import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../../../types/Navigation';
import { usePermissions } from '../../../../hooks/usePermissions';
import { launchImageLibrary } from 'react-native-image-picker';
import { SourceWithId } from '../../../../types/Sources';
import { UPDATE_CHAT } from '../../../../services/chats/mutations/updateChat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GetChatByIdQuery,
  MediaSource,
  UpdateChatSettingsMutation,
} from '../../../../__generated__/graphql';
import { useCallback, useEffect, useState } from 'react';

import Toast from 'react-native-toast-message';
import { makeGraphQLRequest } from '../../../../lib/graphQLClient';
import { useTheme } from 'styled-components';
import { useAuth } from '../../../../context/AuthContext';
import { useUpload } from '../../../../hooks/useUpload';

export function useChatDetailsHeader(chat: GetChatByIdQuery['getChatById']) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { hasAndroidPermission } = usePermissions();
  const navigation = useNavigation<StackProps>();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<SourceWithId | null>();
  const [type, setType] = useState<string | null>();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { uploadFiles, isPending: isPendingUpload } = useUpload();
  const [isPendingHeader, setIsPendingHeader] = useState(false);

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

  const { mutateAsync: updateChatFn, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: async ({
        icon,
        type,
        name,
      }: {
        icon: string | null;
        type: string | null;
        name: string | null;
      }) => {
        const data = await makeGraphQLRequest<UpdateChatSettingsMutation>({
          document: UPDATE_CHAT,
          variables: {
            icon,
            chatId: chat.id,
            type,
            name,
          },
        });

        return data.updateChatSettings;
      },
    }
  );

  const saveChanges = async () => {
    if (!chat || chat.isDirect) return;
    let iconUrl = chat.icon;
    setIsPendingHeader(true);

    try {
      if (icon) {
        try {
          // 🔹 Fazer upload usando o hook
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
          console.error('ERRO-CHATDETAILS-ICON', e);
          Toast.show({
            type: 'error',
            text1: 'Erro ao enviar o ícone',
          });
          return; // sai se o upload falhar
        }
      }

      try {
        await updateChatFn({
          icon: iconUrl as string | null,
          name,
          type: type as string | null,
        });

        await queryClient.refetchQueries({
          queryKey: ['chatDetails', chat.id],
        });

        Toast.show({
          type: 'success',
          text1: 'Chat atualizado com sucesso',
        });
      } catch (e) {
        console.log('ERRO-CHATDETAILS-UPDATE', e);
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar o chat',
        });
      } finally {
        setIsEditingTitle(false);
        setIcon(null);
      }
    } finally {
      setIsPendingHeader(false);
    }
  };

  const handleNameChange = useCallback((text: string) => {
    setName(text);
  }, []);

  useEffect(() => {
    if (chat && chat.name) {
      setName(chat.name);
    }
    if (chat && chat.type) {
      setType(chat.type);
    }
  }, [chat]);

  return {
    chat,
    icon,
    isEditingTitle,
    handleEditTitle,
    handleGallery,
    saveChanges,
    name,
    handleNameChange,
    theme,
    navigation,
    type,
    setType,
    user,
    isPending: isPendingHeader || isPendingUpload || isPendingUpdate,
  };
}
