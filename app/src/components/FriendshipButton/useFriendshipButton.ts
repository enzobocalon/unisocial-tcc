import { useTheme } from 'styled-components';
import {
  BaseUser,
  FriendshipStatusEnum,
  GetFriendRequestStatusQuery,
  GetUserProfileQuery,
  SearchResult,
} from '../../__generated__/graphql';
import { useFriendship } from '../../hooks/useFriendship';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackParams } from '../../types/Navigation';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_FRIEND_REQUEST_STATUS } from '../../services/friendship/queries/getFriendRequestStatus';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasQuery(params: any): params is { query: string } {
  return params && typeof params.query === 'string';
}

export function useFriendshipButton(user: BaseUser) {
  const theme = useTheme();
  const route = useRoute<RouteProp<StackParams>>();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false); // use this to control all requests

  const { acceptFriendship, createFriendship, deleteFriendship } =
    useFriendship();

  const { mutateAsync: refetchStatus, isPending } = useMutation({
    mutationFn: async () => {
      const data = await makeGraphQLRequest<GetFriendRequestStatusQuery>({
        document: GET_FRIEND_REQUEST_STATUS,
        variables: {
          id: user.id,
        },
      });
      return data;
    },
  });

  async function handleFriendship() {
    if (
      !user.friendship ||
      user.friendship.status === FriendshipStatusEnum.None
    ) {
      try {
        setLoading(true);
        const response = await createFriendship(user.id);
        if (response) {
          if (response.success) {
            updateData(FriendshipStatusEnum.Sent, user.id, response.compl_data);
            setLoading(false);
            Toast.show({
              type: 'success',
              text1: response.message || 'Solicitação enviada',
              text2: 'Aguarde a resposta do usuário',
            });
          } else {
            setLoading(false);
            Toast.show({
              type: 'error',
              text1: response?.message || 'Erro ao solicitar amizade',
              text2: 'Tente novamente mais tarde',
            });
            await refetchQueriesOnError();
          }
        } else {
          await refetchQueriesOnError();
          setLoading(false);
        }
      } catch (e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao solicitar amizade',
          text2: 'Tente novamente mais tarde',
        });
        setLoading(false);
        await refetchQueriesOnError();
      }
      return;
    }
    if (user.friendship.status === FriendshipStatusEnum.Received) return;
    if (
      user.friendship.status === FriendshipStatusEnum.Accepted ||
      user.friendship.status === FriendshipStatusEnum.Sent
    ) {
      try {
        Alert.alert(
          user.friendship.status === FriendshipStatusEnum.Accepted
            ? 'Cancelar amizade?'
            : 'Cancelar solicitação?',
          'Essa é um ação definitiva. Você não será capaz de desfazer.',
          [
            {
              text: 'Cancelar',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'Confirmar',
              onPress: async () => {
                setLoading(true);
                if (!user.friendship?.id) {
                  setLoading(false);
                  return;
                }
                const response = await deleteFriendship(user.friendship.id);
                if (response) {
                  if (response.success) {
                    setLoading(false);
                    Toast.show({
                      type: 'success',
                      text1:
                        response.message ||
                        user.friendship?.status ===
                          FriendshipStatusEnum.Accepted
                          ? 'Amizade desfeita com sucesso.'
                          : 'Solicitação cancelada com sucesso.',
                    });
                    updateData(FriendshipStatusEnum.None, user.id);
                  } else {
                    setLoading(false);
                    Toast.show({
                      type: 'error',
                      text1:
                        response.message ||
                        user.friendship?.status ===
                          FriendshipStatusEnum.Accepted
                          ? 'Erro ao desfazer amizade.'
                          : 'Erro ao cancelar solicitação.',
                      text2: 'Tente novamente mais tarde.',
                    });
                    await refetchQueriesOnError();
                  }
                } else {
                  setLoading(false);
                  await refetchQueriesOnError();
                }
              },
            },
          ]
        );
      } catch (e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao cancelar amizade',
          text2: 'Tente novamente mais tarde',
        });
        setLoading(false);
        await refetchQueriesOnError();
      }
      return;
    }
  }

  function updateData(
    status: FriendshipStatusEnum,
    userId: string,
    compl_data?: string | null
  ) {
    const updateUserFriendshipStatus = (
      data: BaseUser[] | undefined | null
    ) => {
      if (data) {
        return data.map((user) => {
          if (user.id === userId) {
            const updatedFriendshipUser = {
              ...user,
              friendship: {
                ...user.friendship,
                status,
                id: compl_data || user.friendship?.id,
              },
            };
            return updatedFriendshipUser;
          }
          return user;
        });
      }
      return data;
    };
    if (route.name === 'DeepSearch' && hasQuery(route.params)) {
      queryClient.setQueryData(
        ['mainSearchScene', route.params?.query],
        (oldData: InfiniteData<SearchResult | undefined>) => {
          if (!oldData || !oldData.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (!page || !page.users) {
                return {
                  ...page,
                };
              }
              return {
                ...page,
                users: updateUserFriendshipStatus(page.users),
              };
            }),
          };
        }
      );

      queryClient.setQueryData(
        ['searchUsers', route.params?.query],
        (oldData: InfiniteData<BaseUser[] | undefined>) => {
          if (!oldData || !oldData.pages) return oldData;

          const updatedPages = oldData.pages.map((page) => {
            if (!page) return page;

            return page.map((user) => {
              if (user.id === userId) {
                return {
                  ...user,
                  friendship: {
                    ...user.friendship,
                    status,
                  },
                };
              }
              return user;
            });
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    }
    if (route.name === 'UserProfile') {
      queryClient.setQueryData(
        ['profile', userId],
        (oldData: GetUserProfileQuery['getUserProfile']) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            friendship: {
              ...oldData.friendship,
              status,
              id: compl_data || oldData.friendship?.id,
            },
          };
        }
      );
    }
  }

  async function handleReceivedFriendship(accept?: boolean) {
    if (user.friendship?.status === FriendshipStatusEnum.Received) {
      if (accept) {
        try {
          setLoading(true);
          if (!user.friendship?.id) {
            setLoading(false);
            return;
          }
          const response = await acceptFriendship(user.friendship.id);
          if (response) {
            if (response.success) {
              updateData(FriendshipStatusEnum.Accepted, user.id);
              setLoading(false);
              Toast.show({
                type: 'success',
                text1: response.message || 'Amizade aceita com sucesso',
              });
            } else {
              setLoading(false);
              Toast.show({
                type: 'error',
                text1: response.message || 'Erro ao aceitar amizade',
                text2: 'Tente novamente mais tarde',
              });
              await refetchQueriesOnError();
            }
          } else {
            setLoading(false);
            await refetchQueriesOnError();
          }
        } catch (e) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao aceitar amizade',
            text2: 'Tente novamente mais tarde',
          });
          setLoading(false);
          await refetchQueriesOnError();
        }
      } else {
        try {
          Alert.alert(
            'Recusar amizade?',
            'Essa é um ação definitiva. Você não será capaz de desfazer.',
            [
              {
                text: 'Cancelar',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: 'Confirmar',
                onPress: async () => {
                  setLoading(true);
                  if (!user.friendship?.id) {
                    setLoading(false);
                    return;
                  }
                  const response = await deleteFriendship(user.friendship.id);
                  if (response) {
                    if (response.success) {
                      updateData(FriendshipStatusEnum.None, user.id);
                      setLoading(false);
                      Toast.show({
                        type: 'success',
                        text1: response.message || 'Amizade recusada',
                      });
                    } else {
                      setLoading(false);
                      Toast.show({
                        type: 'error',
                        text1: response.message || 'Erro ao recusar amizade',
                        text2: 'Tente novamente mais tarde',
                      });
                      await refetchQueriesOnError();
                    }
                  } else {
                    setLoading(false);
                    await refetchQueriesOnError();
                  }
                },
              },
            ]
          );
        } catch (e) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao recusar amizade',
            text2: 'Tente novamente mais tarde',
          });
          await refetchQueriesOnError();
          setLoading(false);
        }
      }
    }
  }

  async function refetchQueriesOnError() {
    const status = await refetchStatus();
    updateData(status.getFriendRequestStatus, user.id);
  }

  return {
    theme,
    handleFriendship,
    isLoading: loading,
    handleReceivedFriendship,
    isPending,
  };
}
