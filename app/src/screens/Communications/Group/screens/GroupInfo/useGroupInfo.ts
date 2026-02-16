import { useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { usePermissions } from '../../../../../hooks/usePermissions';
import { launchImageLibrary } from 'react-native-image-picker';
import { SourceWithId } from '../../../../../types/Sources';
import {
  BaseUser,
  CreateAssignmentMutation,
  CreateChatMutation,
  MediaSource,
} from '../../../../../__generated__/graphql';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../../../lib/graphQLClient';
import { CREATE_CHAT } from '../../../../../services/chats/mutations/createChat';
import { GQLErrors } from '../../../../../lib/errors';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../../../../types/Navigation';
import { CREATE_ASSIGNMENT } from '../../../../../services/assignments/mutations/createAssignment';
import { useAuth } from '../../../../../context/AuthContext';
import { useUpload } from '../../../../../hooks/useUpload';

export function useGroupInfo(members: BaseUser[], isAssignment: boolean) {
  const { width } = Dimensions.get('window');
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const ITEM_SIZE = 56;
  const PADDING = 8;
  const GAP = 8;

  const availableWidth = width - PADDING * 2;
  const NUM_COLUMNS = Math.floor(availableWidth / (ITEM_SIZE + GAP));
  const ITEM_WIDTH = (availableWidth - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<SourceWithId | null>(null);
  const { hasAndroidPermission } = usePermissions();
  const [isPublic, setIsPublic] = useState(false);
  const navigation = useNavigation<StackProps>();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isPendingCreation, setIsPendingCreation] = useState(false);

  const { uploadFiles, isPending: isPendingUpload } = useUpload();

  const screenMembers = useMemo(() => {
    return [user?.me, ...members];
  }, [members, user]);

  const { mutateAsync: createChat, isPending: isPendingCreateChat } =
    useMutation({
      mutationFn: async (icon: string | null) => {
        const data = await makeGraphQLRequest<CreateChatMutation>({
          document: CREATE_CHAT,
          variables: {
            icon: icon ? icon : null,
            users: members.map((member) => member.id),
            type: isPublic ? 'PUBLIC' : 'PRIVATE',
            name,
            isDirect: false,
          },
        });
        return data.createChat;
      },
    });

  const {
    mutateAsync: createAssignment,
    isPending: isPendingCreateAssignment,
  } = useMutation({
    mutationFn: async (icon: string | null) => {
      const data = await makeGraphQLRequest<CreateAssignmentMutation>({
        document: CREATE_ASSIGNMENT,
        variables: {
          icon: icon ? icon : null,
          users: members.map((member) => member.id),
          name,
        },
      });
      return data.createAssignment;
    },
  });

  async function submit() {
    try {
      setIsPendingCreation(true);
      if (!name || members.length <= 0) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Preencha todos os campos',
        });
        return;
      }

      let imageName: string | null = null;

      if (icon) {
        try {
          const uploadedUrls = await uploadFiles([
            {
              extension: icon.extension,
              id: icon.id,
              url: icon.uri,
              source: MediaSource.ImageOnly,
            },
          ]);

          if (uploadedUrls.length === 0) {
            throw new Error('Não foi possível enviar o arquivo.');
          }

          imageName = uploadedUrls[0];
        } catch (e) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Erro ao enviar imagem',
          });
          console.error('GROUP INFO - IMAGEM ERRO - ', e);
          return;
        }
      }

      if (!isAssignment) {
        const chat = await createChat(imageName);
        navigation.navigate('Chat', { chatId: chat.id });
        queryClient.invalidateQueries({ queryKey: ['chats'] });
      } else {
        const assignment = await createAssignment(imageName);
        navigation.navigate('Assignment', { assignmentId: assignment.id });
        queryClient.refetchQueries({ queryKey: ['allAssignments'] });
        // navigation.navigate('Communications');
      }
    } catch (e) {
      if (e instanceof GQLErrors) {
        Toast.show({
          type: 'error',
          text1: isAssignment
            ? 'Erro ao criar atividade'
            : 'Erro ao criar grupo',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro interno. Tente novamente mais tarde.',
      });
    } finally {
      setIsPendingCreation(false);
    }
  }

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

  return {
    NUM_COLUMNS,
    ITEM_WIDTH,
    name,
    setName,
    submit,
    handleGallery,
    icon,
    isPublic,
    screenMembers,
    setIsPublic,
    isPending:
      isPendingCreation ||
      isPendingCreateChat ||
      isPendingCreateAssignment ||
      isPendingUpload,
    setIsLoadingImage,
    isLoadingImage,
  };
}
