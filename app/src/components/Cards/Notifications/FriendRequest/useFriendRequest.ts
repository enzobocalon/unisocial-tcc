import { useTheme } from 'styled-components';
import { Notification } from '../../../../__generated__/graphql';
import { useFriendship } from '../../../../hooks/useFriendship';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../../../types/Navigation';

export function useFriendRequestNotification(notification: Notification) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const {
    acceptFriendship,
    deleteFriendship,
    isPendingAcceptFriendship,
    isPendingDeleteFriendship,
  } = useFriendship();
  const navigation = useNavigation<StackProps>();

  const accept = async () => {
    try {
      if (!notification?.friendshipId) return;
      const response = await acceptFriendship(notification?.friendshipId);
      if (response?.success) {
        Toast.show({
          type: 'success',
          text1: response.message || 'Amizade aceita',
        });
        queryClient.setQueryData(
          ['friendRequests'],
          (data: InfiniteData<Notification[]>) => {
            const updatedData = data.pages
              .flatMap((item) => item)
              .filter((item) => item.id !== notification.id);
            return {
              ...data,
              pages: updatedData,
            };
          }
        );
      } else {
        Toast.show({
          type: 'error',
          text1: response?.message || 'Erro ao aceitar amizade',
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao aceitar amizade',
      });
    }
  };

  const deny = async () => {
    try {
      if (!notification?.friendshipId) return;
      const response = await deleteFriendship(notification?.friendshipId);
      if (response?.success) {
        Toast.show({
          type: 'success',
          text1: response.message || 'Amizade recusada',
        });
        queryClient.setQueryData(
          ['friendRequests'],
          (data: InfiniteData<Notification[]>) => {
            const updatedData = data.pages
              .flatMap((item) => item)
              .filter((item) => item.id !== notification.id);
            return {
              ...data,
              pages: updatedData,
            };
          }
        );
      } else {
        Toast.show({
          type: 'error',
          text1: response?.message || 'Erro ao recusar amizade',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    theme,
    accept,
    deny,
    navigation,
    isPendingAcceptFriendship,
    isPendingDeleteFriendship,
  };
}
