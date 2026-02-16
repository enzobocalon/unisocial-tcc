import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { StackProps } from '../../../../types/Navigation';
import { useCallback, useState } from 'react';
import { SourceWithId } from '../../../../types/Sources';
import { usePermissions } from '../../../../hooks/usePermissions';
import { launchImageLibrary } from 'react-native-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Assignment,
  MediaSource,
  UpdateAssignmentMutation,
} from '../../../../__generated__/graphql';
import { makeGraphQLRequest } from '../../../../lib/graphQLClient';
import { UPDATE_ASSIGNMENT } from '../../../../services/assignments/mutations/updateAssignment';
import Toast from 'react-native-toast-message';
import { useCanNavigate } from '../../../../hooks/useCanNavigate';
import { useUpload } from '../../../../hooks/useUpload';

export function useAssignmentDetailsHeader(assignment: Assignment) {
  const theme = useTheme();
  const navigation = useNavigation<StackProps>();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [icon, setIcon] = useState<SourceWithId | null>(null);
  const [name, setName] = useState(assignment.name);
  const { hasAndroidPermission } = usePermissions();
  const { handleChatAssignmentNavigation, isPendingNavigate } =
    useCanNavigate('ASSIGNMENT');
  const queryClient = useQueryClient();

  const { isPending: isPendingUpload, uploadFiles } = useUpload();

  const [isPendingHeader, setIsPendingerHeader] = useState(false);

  const handleEditTitle = () => {
    setIsEditingTitle((prev) => !prev);
  };

  const handleGallery = async () => {
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
        const assets = result.assets.map((asset) => ({
          id: asset.fileName?.split('.')[0],
          extension: asset.fileName?.split('.')[1],
          uri: asset.uri,
        })) as SourceWithId[];
        setIcon(assets[0]);
      }
    }
  };

  const { mutateAsync: updateAssignmentFn, isPending: isPendingUpdate } =
    useMutation({
      mutationKey: ['updateAssignment', assignment.id],
      mutationFn: async ({
        icon,
        name,
      }: {
        icon: string | null;
        name: string | null;
      }) => {
        const data = await makeGraphQLRequest<UpdateAssignmentMutation>({
          document: UPDATE_ASSIGNMENT,
          variables: {
            icon: icon,
            name: name,
            assignmentId: assignment.id,
          },
        });
        return data.updateAssignment;
      },
    });

  async function saveChanges() {
    let iconUrl = assignment.icon;
    try {
      if (icon) {
        try {
          setIsPendingerHeader(true);
          const uploadedUrls = await uploadFiles([
            {
              id: icon.id,
              url: icon.uri,
              extension: icon.extension,
              source: MediaSource.ImageOnly,
            },
          ]);

          if (uploadedUrls.length === 0) {
            throw new Error('Não foi possível gerar URL para upload');
          }

          iconUrl = uploadedUrls[0];
        } catch (e) {
          console.error('ERRO-ASSIGNMENTDETAILS-ICON', e);
          Toast.show({
            type: 'error',
            text1: 'Erro ao enviar o ícone',
          });
          return;
        }
      }

      try {
        await updateAssignmentFn({
          icon: iconUrl as string | null,
          name,
        });

        await queryClient.refetchQueries({
          queryKey: ['getAssignment', assignment.id],
        });

        Toast.show({
          type: 'success',
          text1: 'Atividade atualizada com sucesso',
        });
      } catch (e) {
        console.log('ERRO-ASSIGNMENTDETAILS-UPDATE', e);
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar o Assignment',
        });
      } finally {
        setIsEditingTitle(false);
        setIcon(null);
      }
    } finally {
      setIsPendingerHeader(false);
    }
  }

  const handleNameChange = useCallback((text: string) => {
    setName(text);
  }, []);

  const handleCanNavigate = useCallback(() => {
    if (!assignment.chatId) return;
    handleChatAssignmentNavigation(assignment.id, assignment.chatId);
  }, []);

  return {
    theme,
    navigation,
    isEditingTitle,
    handleEditTitle,
    handleGallery,
    icon,
    name,
    handleNameChange,
    saveChanges,
    handleCanNavigate,
    isPendingNavigate,
    isPending: isPendingHeader || isPendingUpload || isPendingUpdate,
  };
}
