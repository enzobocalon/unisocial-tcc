import { useMemo, useState } from 'react';
import { useTheme } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import {
  BaseUser,
  Course,
  GetCoursesQuery,
  MediaSource,
  MeQuery,
  UpdateProfileMutation,
} from '../../__generated__/graphql';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_COURSES } from '../../services/courses/queries/getCourses';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePermissions } from '../../hooks/usePermissions';
import { launchImageLibrary } from 'react-native-image-picker';
import { getFileExtension } from '../../utils/getMediaExtension';
import { UPDATE_PROFILE } from '../../services/users/mutation/updateProfile';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';
import Toast from 'react-native-toast-message';
import { useScreenTransition } from '../../hooks/useScreenTransition';
import { createPath } from '../../utils/path';
import { useUpload } from '../../hooks/useUpload';

const schema = z.object({
  name: z.string(),
  bio: z.string().optional(),
  courseId: z.string(),
  avatar: z.string().optional(),
  banner: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export function useEditProfile() {
  const { user } = useAuth();
  const {
    control,
    setValue,
    watch,
    handleSubmit: hookHandleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.me.name,
      bio: user?.me.bio || undefined,
      courseId: user?.me.course?.id,
      banner: createPath(user?.me.banner) || undefined,
      avatar: undefined,
    },
  });
  const avatar = watch('avatar');
  const banner = watch('banner');
  const [open, setOpen] = useState(false);
  const [pickerValue, setPickerValue] = useState('');
  const theme = useTheme();
  const navigation = useNavigation<StackProps>();
  const queryClient = useQueryClient();
  const { hasAndroidPermission } = usePermissions();
  const { transitionFinished } = useScreenTransition();
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);

  const { isLoading: pickerLoading, data: rawItems } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { getCourses: data } = await makeGraphQLRequest<GetCoursesQuery>({
        document: GET_COURSES,
      });
      data.forEach((course) => {
        if (course.id === user?.me.course?.id) setPickerValue(course.id);
      });
      return data;
    },
  });

  const [isPendingProfileEdit, setIsPendingProfileEdit] = useState(false);
  const { isPending: isPendingUpload, uploadFiles } = useUpload();

  const { mutateAsync: updateProfileFn, isPending: isPendingUpdate } =
    useMutation({
      mutationKey: ['updateProfile', user?.me.id],
      mutationFn: async (data: { data: Schema }) => {
        const { updateProfile: response } =
          await makeGraphQLRequest<UpdateProfileMutation>({
            document: UPDATE_PROFILE,
            variables: {
              data: {
                ...data.data,
                courseId: pickerValue,
              },
            },
          });
        return response;
      },
    });

  const items = useMemo(() => {
    if (!rawItems) return [];
    return rawItems.map((course: Course) => {
      return {
        label: course.name,
        value: course.id,
      };
    });
  }, [rawItems]);

  const handleGallery = async (type: 'AVATAR' | 'BANNER') => {
    if (type !== 'AVATAR' && type !== 'BANNER') return;
    if (await hasAndroidPermission()) {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
        selectionLimit: 1,
        presentationStyle: 'fullScreen',
      });
      if (result.didCancel) {
        return;
      }
      if (result.assets) {
        if (type === 'AVATAR') {
          setValue('avatar', result.assets[0].uri);
        }
        if (type === 'BANNER') {
          setValue('banner', result.assets[0].uri);
        }
      }
    }
  };

  const handleSubmit = hookHandleSubmit(async (formData) => {
    try {
      setIsPendingProfileEdit(true);
      let avatarResponse: string | null = null;
      let bannerResponse: string | null = null;

      // Só tenta upload se tiver avatar ou banner novo
      const newFiles: {
        id: string;
        uri: string;
        extension: string;
        type: 'avatar' | 'banner';
      }[] = [];

      if (formData.avatar) {
        newFiles.push({
          id: `avatar-${user?.me.id}`,
          uri: formData.avatar,
          extension: getFileExtension(formData.avatar) as string,
          type: 'avatar',
        });
      }
      if (formData.banner && formData.banner !== user?.me.banner) {
        newFiles.push({
          id: `banner-${user?.me.id}`,
          uri: formData.banner,
          extension: getFileExtension(formData.banner) as string,
          type: 'banner',
        });
      }

      if (newFiles.length) {
        const uploadedUrls = await uploadFiles(
          newFiles.map((i) => ({
            id: i.id,
            extension: i.extension,
            url: i.uri,
            source: MediaSource.ImageOnly,
          }))
        );
        uploadedUrls.forEach((url, i) => {
          if (newFiles[i].type === 'avatar') avatarResponse = url;
          if (newFiles[i].type === 'banner') bannerResponse = url;
        });
      }

      const updateDTO = {
        ...formData,
        avatar: avatarResponse || undefined,
        banner: bannerResponse || undefined,
      };

      const data = await updateProfileFn({ data: updateDTO });

      queryClient.setQueryData(['me'], (oldData: MeQuery) => ({
        me: {
          ...oldData.me,
          name: data.name || oldData.me.name,
          bio: data.bio || oldData.me.bio,
          avatar: data.avatar || oldData.me.avatar,
          banner: data.banner || oldData.me.banner,
        },
      }));

      queryClient.setQueryData(
        ['profile', user?.me.id],
        (oldData: BaseUser) => ({
          ...oldData,
          name: data.name || oldData.name,
          bio: data.bio || oldData.bio,
          avatar: data.avatar || oldData.avatar,
          banner: data.banner || oldData.banner,
        })
      );

      Toast.show({
        type: 'success',
        text1: 'Perfil atualizado',
      });
      navigation.goBack();
    } catch (e) {
      console.error('error on updateProfile', e);
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar perfil',
      });
    } finally {
      setIsPendingProfileEdit(true);
    }
  });

  return {
    open,
    setOpen,
    items,
    setPickerValue,
    user,
    theme,
    pickerLoading,
    pickerValue,
    control,
    avatar,
    banner,
    handleGallery,
    handleSubmit,
    errors,
    submitLoading: isPendingProfileEdit || isPendingUpload || isPendingUpdate,
    loading: !transitionFinished,
    setIsLoadingBanner,
    isLoadingBanner,
  };
}
