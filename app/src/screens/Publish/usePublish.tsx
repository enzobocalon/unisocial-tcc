import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import { usePermissions } from '../../hooks/usePermissions';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { useForm } from 'react-hook-form';
import {
  CreatePostMutation,
  Media,
  MediaSource,
  Post,
  PostByIdQuery,
  SharePostMutation,
  TimelineByCourseQuery,
  TimelineQuery,
  UpdatePostMutation,
} from '../../__generated__/graphql';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native';
import { useTheme } from 'styled-components';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { CREATE_POST } from '../../services/posts/mutations/createPost';
import Toast from 'react-native-toast-message';
import { StackProps } from '../../types/Navigation';
import { useMention } from '../../hooks/useMention';
import { createPath, extractPath } from '../../utils/path';
import { env } from '../../lib/env';
import { UPDATE_POST } from '../../services/posts/mutations/updatePost';
import { MentionSuggestionsProps } from 'react-native-controlled-mentions';
import { MentionPopup } from '../../components/MentionPopup';
import { SHARE_POST } from '../../services/posts/mutations/sharePost';
import { GET_POST_BY_ID } from '../../services/posts/queries/getPost';
import { useUpload } from '../../hooks/useUpload';

const schema = z
  .object({
    content: z.string().optional(),
    medias: z
      .array(
        z.object({
          id: z.string(),
          url: z.string(),
          extension: z.string(),
        })
      )
      .optional(),
  })
  .refine((data) => {
    if (!data.content && !data.medias?.length) {
      return false;
    }
    return true;
  }, 'Você precisa adicionar um texto ou uma imagem');

const addPhoto: PhotoIdentifier = {
  node: {
    type: 'image',
    id: 'APP_ADD',
    group_name: ['APP_ADD'],
    image: {
      filename: 'APP_ADD',
      uri: 'APP_ADD',
      height: 0,
      width: 0,
      extension: 'jpg',
      playableDuration: 0,
      filepath: 'APP_ADD',
      fileSize: 0,
      orientation: 1,
    },
    location: null,
    timestamp: 0,
    modificationTimestamp: 0,
    sourceType: 'UserLibrary',
    subTypes: 'PhotoLive',
  },
};

type Params = {
  isSharing?: boolean;
  post?: Post;
};
type PublishSchema = z.infer<typeof schema>;

export function usePublish({ isSharing, post }: Params) {
  const [devicePhotos, setDevicePhotos] = useState<PhotoIdentifier[]>([]);
  const { user } = useAuth();
  const { formatFromMetaTagToPublish, formatFromMentionToRequest } =
    useMention();
  const navigation = useNavigation<StackProps>();

  const [publishLoading, setPublishLoading] = useState(false);
  const { hasAndroidPermission } = usePermissions();
  const theme = useTheme();
  const {
    control,
    handleSubmit: hookHandleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PublishSchema>({
    resolver: zodResolver(schema),
  });

  const { uploadFiles, isPending: isPendingUpload } = useUpload();

  const selectedImages = watch('medias', []);
  const mentionBottomSheetRef = useRef<BottomSheetModal>(null);
  const textInputRef = useRef<TextInput>(null);
  const queryClient = useQueryClient();
  const { mutateAsync: publishPost, isPending } = useMutation({
    mutationFn: async ({
      content,
      medias,
    }: {
      content: string;
      medias: string[];
    }) => {
      if (!isSharing && !post?.id) {
        const { createPost: data } =
          await makeGraphQLRequest<CreatePostMutation>({
            document: CREATE_POST,
            variables: {
              content,
              medias: medias || [],
            },
          });
        return data;
      }

      if (!isSharing && post?.id) {
        const { updatePost: data } =
          await makeGraphQLRequest<UpdatePostMutation>({
            document: UPDATE_POST,
            variables: {
              id: post.id,
              content,
              medias,
            },
          });
        return data;
      }

      if (isSharing && post?.id) {
        const { share: data } = await makeGraphQLRequest<SharePostMutation>({
          document: SHARE_POST,
          variables: {
            content,
            medias,
            parentId: post.id,
          },
        });
        return data;
      }
      return null;
    },
  });

  const { data } = useQuery({
    queryKey: ['editing', post?.id],
    queryFn: async () => {
      const { postById: data } = await makeGraphQLRequest<PostByIdQuery>({
        document: GET_POST_BY_ID,
        variables: {
          id: post?.id,
        },
      });
      return data;
    },
    enabled: !isSharing && !!post,
    staleTime: 0,
  });

  const handleGallery = async () => {
    if (await hasAndroidPermission()) {
      const result = await launchImageLibrary({
        mediaType: 'mixed',
        quality: 0.5,
        selectionLimit: 100,
        presentationStyle: 'fullScreen',
      });
      if (result.didCancel) {
        return;
      }
      if (result.assets) {
        if (selectedImages && !selectedImages.length) {
          const assets = result.assets.map((asset) => ({
            id: asset.fileName?.split('.')[0],
            extension: asset.fileName?.split('.')[1],
            url: asset.uri,
          })) as (Media & { extension: string })[];
          setValue('medias', assets);
          return;
        }
        const assets = result.assets.filter(
          (asset) =>
            asset.fileName &&
            selectedImages?.some(
              (image) => image.id !== asset.fileName!.split('.')[0]
            )
        );
        setValue(
          'medias',
          selectedImages?.concat(
            assets.map(
              (asset) =>
                ({
                  id: asset.fileName!.split('.')[0],
                  extension: asset.fileName!.split('.')[1],
                  url: asset.uri,
                }) as Media & { extension: string }
            )
          )
        );
      }
    }
  };

  const getRecentPhotos = async () => {
    const hasPermission = await hasAndroidPermission();
    if (hasPermission) {
      const photos = await CameraRoll.getPhotos({
        first: 15,
        assetType: 'All',
      });
      setDevicePhotos([...photos.edges, addPhoto]);
    }
  };

  const handleDeviceMediaSelection = (photo: PhotoIdentifier) => {
    if (photo.node.id === 'APP_ADD') {
      return handleGallery();
    }
    setValue(
      'medias',
      selectedImages?.concat({
        id: photo.node.id,
        url: photo.node.image.uri,
        extension: photo.node.type.split('/')[1],
      })
    );
  };

  const onSourceChange = useCallback(
    (source: Media) => {
      setValue(
        'medias',
        selectedImages?.filter((item) => item.url !== source.url)
      );
    },
    [selectedImages]
  );

  useEffect(() => {
    getRecentPhotos();
  }, []);

  const renderSuggestions: FC<MentionSuggestionsProps> = ({
    keyword,
    onSuggestionPress,
  }) => {
    if (keyword) {
      mentionBottomSheetRef.current?.present();
    } else {
      mentionBottomSheetRef.current?.dismiss();
    }
    return (
      <MentionPopup
        ref={mentionBottomSheetRef}
        mentionText={keyword as string}
        onMention={onSuggestionPress}
      />
    );
  };

  const handleSubmit = hookHandleSubmit(async (formData) => {
    try {
      setPublishLoading(true);
      if (errors.content || errors.medias) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao publicar',
          text2: 'Você precisa adicionar um texto ou uma imagem',
        });
        return;
      }

      let mediasName: string[] =
        formData.medias?.map((item) => extractPath(item.url)) || [];

      if (formData.medias?.length) {
        const newMedias = formData.medias.filter(
          (item) =>
            !item.url.includes(env.RAW_API_URL) &&
            !item.url.includes('amazonaws') // apenas arquivos novos
        );

        const uploadedUrls = await uploadFiles(
          newMedias.map((i) => ({
            ...i,
            source: MediaSource.Default,
          }))
        );
        mediasName.push(...uploadedUrls);
      }

      mediasName = mediasName.filter(
        (item) => !item.startsWith('file://') && !item.startsWith('content://')
      );

      // 🔹 Continue com a lógica de publicar/update/share
      const content = formData.content
        ? formatFromMentionToRequest(formData.content)
        : '';

      const isEditing = post?.id && !isSharing;

      const data = (await publishPost({
        content,
        medias: mediasName,
      })) as Post;

      if (data) {
        queryClient.setQueryData(
          ['timeline'],
          (oldData: InfiniteData<TimelineQuery>) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page, index) => {
                if (!page) return page;

                let newTimeline = page.timeline;

                if (isEditing) {
                  // Atualizar posts existentes
                  newTimeline = page.timeline.map((item) => {
                    // Se for o post sendo editado diretamente
                    if (item.id === data.id) {
                      return {
                        ...item,
                        // Atualiza apenas os campos que mudaram
                        content: data.content,
                        media: data.media,
                        hasMedia: data.hasMedia,
                        updatedAt: data.updatedAt,
                        key: item.key,
                      };
                    }

                    // Se for um compartilhamento (share) do post sendo editado
                    if (item.parent && item.parent.id === data.id) {
                      return {
                        ...item,
                        parent: {
                          ...item.parent,
                          id: data.id,
                          hasMedia: data.hasMedia,
                          updatedAt: data.updatedAt,
                          content: data.content,
                          media: data.media,
                        },
                        key: item.key, // Preserva a key original
                      };
                    }

                    return item;
                  });
                } else {
                  // Se não está editando, adicionar novo post (apenas na primeira página)
                  if (index === 0) {
                    const exists = page.timeline.some(
                      (item) =>
                        item.id === data.id || item.parent?.id === data.id
                    );
                    if (!exists) {
                      newTimeline = [
                        { ...data, key: data.id }, // Define key explícita
                        ...page.timeline,
                      ];
                    }
                  }
                }

                return {
                  ...page,
                  timeline: newTimeline,
                };
              }),
            };
          }
        );

        // Não existe interações com parent pra mostrar na timeline de curso
        queryClient.setQueryData(
          ['courseTimeline'],
          (
            oldData: InfiniteData<TimelineByCourseQuery['timelineByCourse']>
          ) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                if (!page || !Array.isArray(page)) return page;

                return page.map((item) => {
                  if (item.id === data.id) {
                    return {
                      ...item,
                      content: data.content,
                      media: data.media,
                      hasMedia: data.hasMedia,
                      updatedAt: data.updatedAt,
                      key: item.key,
                    };
                  }
                  return item;
                });
              }),
            };
          }
        );

        Toast.show({
          type: 'success',
          text1: isEditing ? 'Atualizado com sucesso' : 'Publicado com sucesso',
        });
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate('index');
      }
    } catch (e: unknown) {
      console.error(e);
      Toast.show({
        type: 'error',
        text1: 'Erro ao publicar',
        text2: 'Tente novamente mais tarde.',
      });
    } finally {
      setPublishLoading(false);
    }
  });

  useEffect(() => {
    if (data) {
      if (data.content) {
        const { content } = formatFromMetaTagToPublish(data.content);
        setValue('content', content);
      }
      if (data.media) {
        const medias = data.media.map((item) => {
          return {
            id: item.url.split('/')[0].split('.')[0], // filename - TODO: requer mais testes
            url: createPath(item.url) as string,
            extension: item.url.split('.')[1],
          };
        });
        setValue('medias', medias);
      }
    }
  }, [data]);

  const canPublicate = !!(watch('content') || selectedImages?.length);

  return {
    user,
    navigation,
    devicePhotos,
    handleDeviceMediaSelection,
    selectedImages,
    handleGallery,
    onSourceChange,
    control,
    mentionBottomSheetRef,
    textInputRef,
    handleSubmit,
    renderSuggestions,
    theme,
    isPending: isPending || isPendingUpload || publishLoading,
    canPublicate,
  };
}
