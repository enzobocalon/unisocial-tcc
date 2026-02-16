import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, {
  FC,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { TextInput } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { ReplyRef } from '../../../types/Refs';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../lib/graphQLClient';
import { GET_REPLIES } from '../../../services/posts/queries/getReplies';
import {
  CreateReplyMutation,
  Media,
  MediaSource,
  Post,
  RepliesQuery,
  Reply,
  UpdateReplyMutation,
} from '../../../__generated__/graphql';
import { useTheme } from 'styled-components';
import { CREATE_REPLY } from '../../../services/posts/mutations/createReply';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MentionPopup } from '../../MentionPopup';
import { MentionSuggestionsProps } from 'react-native-controlled-mentions';
import { launchImageLibrary } from 'react-native-image-picker';
import { usePermissions } from '../../../hooks/usePermissions';
import { useMention } from '../../../hooks/useMention';
import { env } from '../../../lib/env';
import Toast from 'react-native-toast-message';
import { UPDATE_REPLY } from '../../../services/posts/mutations/updateReply';
import { createPath, extractPath } from '../../../utils/path';
import { useUpload } from '../../../hooks/useUpload';

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

type PublishReplySchema = z.infer<typeof schema>;

export function useReplies(
  ref: React.Ref<ReplyRef>,
  post: Post,
  setReplies: React.Dispatch<React.SetStateAction<number>>,
  queryKey: string
) {
  const { user } = useAuth();
  const bottomRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef<TextInput>(null);
  const [editing, setEditing] = useState<Reply | null>(null);
  const mentionBottomSheetRef = useRef<BottomSheetModal>(null);
  const [parent, setParent] = useState<Reply | null>(null);
  const theme = useTheme();
  const { isPending: isPendingUpload, uploadFiles } = useUpload();
  const [requestLoading, setRequestLoading] = useState(false);
  const { formatFromMentionToRequest } = useMention();
  const { hasAndroidPermission } = usePermissions();
  const {
    control,
    handleSubmit: hookHandleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PublishReplySchema>({
    resolver: zodResolver(schema),
  });
  const queryClient = useQueryClient();
  const selectedImages = watch('medias', []);
  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [queryKey, 'replies', post.id],
    queryFn: async ({ pageParam }) => {
      try {
        const { replies: data } = await makeGraphQLRequest<RepliesQuery>({
          document: GET_REPLIES,
          variables: {
            postId: post.id,
            page: pageParam,
          },
        });
        return data;
      } catch (e) {
        console.log(e);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.length > 0) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!post && !!post.id,
  });

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current?.focus();
      },
      present() {
        bottomRef.current?.present();
      },
    };
  });

  const handleReplySelection = useCallback((reply: Reply) => {
    setParent(reply);
    inputRef.current?.focus();
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

  const { mutateAsync: createReplyFn, isPending: isPendingCreate } =
    useMutation({
      mutationFn: async ({
        content,
        medias,
      }: {
        content: string;
        medias: string[];
      }) => {
        const { createReply: data } =
          await makeGraphQLRequest<CreateReplyMutation>({
            document: CREATE_REPLY,
            variables: {
              content: content,
              medias: medias,
              postId: post.id,
              parentId: parent
                ? parent.parentId
                  ? parent.parentId
                  : parent.id
                : null, // retorna o comentário original, pela lógica do servidor - não pode criar reposta de resposta de resposta...
            },
          });
        return data;
      },
    });

  const { mutateAsync: updateReplyFn, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: async ({
        content,
        medias,
        id,
      }: {
        content: string;
        medias: string[];
        id: string;
      }) => {
        const { updateReply: data } =
          await makeGraphQLRequest<UpdateReplyMutation>({
            document: UPDATE_REPLY,
            variables: {
              content,
              medias,
              id,
            },
          });
        return data;
      },
      mutationKey: ['updateReply'],
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
        const newAssets = result.assets.map((asset) => ({
          id: asset.fileName?.split('.')[0],
          extension: asset.fileName?.split('.')[1] || '',
          url: asset.uri,
        })) as (Media & { extension: string })[];

        if (selectedImages && selectedImages.length > 0) {
          // Filtrar apenas imagens que ainda não estão na lista
          const uniqueAssets = newAssets.filter(
            (newAsset) =>
              !selectedImages.some((image) => image.id === newAsset.id)
          );

          setValue('medias', [...selectedImages, ...uniqueAssets]);
        } else {
          // Se não há imagens selecionadas, adicionar todas
          setValue('medias', newAssets);
        }
      }
    }
  };

  const handleEdit = useCallback(
    (reply: Reply | null) => {
      if (reply && reply.user.id === user?.me.id) {
        setEditing(reply);
        setValue('content', reply.content || '');
        setValue(
          'medias',
          reply.medias?.map((item) => ({
            id: item.id,
            extension: item.url.split('.').pop() || '',
            url: createPath(item.url)!,
          })) || []
        );
        return;
      }
      setEditing(null);
      setValue('content', undefined);
      setValue('medias', undefined);
    },
    [user]
  );

  const onSourceChange = useCallback(
    (source: Media) => {
      setValue(
        'medias',
        selectedImages?.filter((item) => item.url !== source.url)
      );
    },
    [selectedImages]
  );

  const handleSubmit = hookHandleSubmit(async (formData) => {
    const mediasName: string[] = [];

    try {
      setRequestLoading(true);
      const newMedias = formData.medias?.filter(
        (item) =>
          !item.url.includes(env.RAW_API_URL) && !item.url.includes('amazonaws')
      );

      if (newMedias?.length) {
        const uploadedUrls = await uploadFiles(
          newMedias.map((i) => ({
            ...i,
            source: MediaSource.Default,
          }))
        );
        mediasName.push(...uploadedUrls);
      }

      if (formData.medias) {
        const validMedias = formData.medias
          .filter(
            (item) =>
              item.url.startsWith(env.RAW_API_URL) ||
              item.url.includes('amazonaws')
          )
          .map((item) => extractPath(item.url));
        mediasName.push(...validMedias);
      }

      const content = formData.content
        ? formatFromMentionToRequest(formData.content)
        : '';

      // 🔹 Criar ou atualizar comentário
      if (!editing) {
        const data = await createReplyFn({ content, medias: mediasName });
        if (!data) throw new Error('Erro ao criar comentário');
        data.createdAt = new Date().toISOString();

        if (!parent) {
          queryClient.setQueryData(
            [queryKey, 'replies', post.id],
            (oldData: InfiniteData<Reply[]>) => {
              if (!oldData || !oldData.pages) return oldData;
              const newData = [...oldData.pages, [data]];
              return { ...oldData, pages: newData };
            }
          );
        } else {
          queryClient.setQueryData(
            ['getChildrenReplies', parent.parentId ?? parent.id],
            (oldData: InfiniteData<Reply[]>) => {
              if (!oldData || !oldData.pages) return oldData;
              return { ...oldData, pages: [...oldData.pages, data] };
            }
          );
          queryClient.setQueryData(
            [queryKey, 'replies', post.id],
            (oldData: InfiniteData<Reply[]>) => {
              if (!oldData || !oldData.pages) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((reply) => {
                  const replyIndex = reply.findIndex(
                    (r) => r.id === parent.id || r.id === parent.parentId
                  );
                  if (replyIndex > -1) {
                    reply[replyIndex] = {
                      ...reply[replyIndex],
                      replies: reply[replyIndex].replies + 1,
                    };
                  }
                  return reply;
                }),
              };
            }
          );
        }

        setReplies((prev) => prev + 1);
        Toast.show({ type: 'success', text1: 'Comentário enviado' });
      } else {
        // 🔹 Atualizar comentário
        const data = await updateReplyFn({
          content,
          medias: mediasName,
          id: editing.id,
        });
        if (!data) throw new Error('Erro ao atualizar comentário');

        if (data.parentId) {
          queryClient.setQueryData(
            [queryKey, 'getChildrenReplies', data.parentId],
            (oldData: InfiniteData<Reply[]>) => {
              return {
                ...oldData,
                pages: oldData.pages.map((reply) =>
                  reply.map((item) => (item.id === data.id ? data : item))
                ),
              };
            }
          );
        } else {
          queryClient.setQueryData(
            [queryKey, 'replies', post.id],
            (oldData: InfiniteData<Reply[]>) => {
              return {
                ...oldData,
                pages: oldData.pages.map((reply) =>
                  reply.map((item) => (item.id === data.id ? data : item))
                ),
              };
            }
          );
        }

        setEditing(null);
        Toast.show({ type: 'success', text1: 'Comentário atualizado' });
      }

      setValue('content', '');
      setValue('medias', []);
      setParent(null);
    } catch (e) {
      console.error(e);
      Toast.show({
        type: 'error',
        text1: 'Erro ao compartilhar',
        text2: 'Tente novamente mais tarde.',
      });
    } finally {
      setRequestLoading(false);
    }
  });

  return {
    user,
    bottomRef,
    inputRef,
    data: data?.pages.flatMap((page) => page) || [],
    loading: isLoading,
    hasNextPage,
    fetchNextPage,
    theme,
    parent,
    handleReplySelection,
    setParent,
    control,
    renderSuggestions,
    handleGallery,
    selectedImages,
    onSourceChange,
    handleSubmit,
    handleEdit,
    editing,
    isPending:
      requestLoading || isPendingCreate || isPendingUpload || isPendingUpdate,
  };
}
