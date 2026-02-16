import { launchImageLibrary } from 'react-native-image-picker';
import { usePermissions } from '../../hooks/usePermissions';
import { Source, SourceWithId } from '../../types/Sources';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActiveChatSubscription,
  BaseUser,
  Chat,
  ChatContent,
  ChatMember,
  ContentAction,
  DeleteMessageMutation,
  FriendStatusSubscription,
  GetAllChatsQuery,
  GetChatByIdQuery,
  GetChatMessagesQuery,
  MediaSource,
  Message,
  SendMessageMutation,
  UpdateMessagesStatusMutation,
} from '../../__generated__/graphql';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { GET_CHAT_MESSAGES } from '../../services/messages/queries/getChatMessages';
import { PAGE_SIZE } from '../../lib/constants';
import { IMessage } from 'react-native-gifted-chat';
import { SEND_MESSAGE_IN_CHAT } from '../../services/messages/mutations/sendMessageInChat';
import { useAuth } from '../../context/AuthContext';
import { GET_CHAT_BY_ID } from '../../services/chats/queries/getChatById';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';
import { useChatParser } from '../../hooks/useChatParser';
import { useTheme } from 'styled-components';
import avatarPlaceholder from '../../assets/images/avatar-placeholder.png';
import Toast from 'react-native-toast-message';
import { ChatMessage } from '../../types/ChatMessage';
import { UPDATE_MESSAGE_STATUS } from '../../services/messages/queries/updateMessageStatus';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSubscription } from '../../hooks/useSubscription';
import { ACTIVE_CHAT_SUB } from '../../services/chats/subscriptions/activeChat';
import { DELETE_MESSAGE } from '../../services/messages/mutations/deleteMessage';
import { useFriendsStatus } from '../../hooks/useFriendStatus';
import { env } from '../../lib/env';
import { createPath } from '../../utils/path';
import { useUpload } from '../../hooks/useUpload';
import { Alert, Keyboard } from 'react-native';
import { useRefetchOnAppFocus } from '../../hooks/useRefetchOnAppFocus';

export function useChat(chatId: string) {
  const { hasAndroidPermission } = usePermissions();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [medias, setMedias] = useState<SourceWithId[]>([]);
  const navigation = useNavigation<StackProps>();
  const { parseContentAction } = useChatParser();
  const theme = useTheme();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const isFocused = useIsFocused();
  const isFirstRender = useRef(true);

  const PAGE_LIMIT = 10;
  const CHECK_LIMIT = 5;

  const [isPendingChatSend, setIsPendingChatSend] = useState(false);
  const { isPending: isPendingUpload, uploadFiles } = useUpload();

  const { mutateAsync: markChatAsRead } = useMutation({
    mutationKey: ['updateMessagesStatus', chatId],
    mutationFn: async () => {
      try {
        await makeGraphQLRequest<UpdateMessagesStatusMutation>({
          document: UPDATE_MESSAGE_STATUS,
          variables: {
            chatId,
          },
        });
      } catch (e) {
        console.log('Erro ao marcar como lido', e);
      }
    },
  });

  const { data: chat, isLoading: isLoadingChat } = useQuery({
    queryKey: ['activeChat', chatId],
    queryFn: async () => {
      const data = await makeGraphQLRequest<GetChatByIdQuery>({
        document: GET_CHAT_BY_ID,
        variables: {
          chatId,
        },
      });
      if (!data) {
        navigation.navigate('Communications');
      }
      return data.getChatById;
    },
    refetchOnMount: 'always',
  });

  const removeUnreadCount = useCallback(() => {
    queryClient.setQueryData(
      ['allChats'],
      (oldData: InfiniteData<GetAllChatsQuery['getAllChats']>) => {
        if (!oldData) return oldData;
        const updatedPages = oldData.pages.map((page) =>
          page.map((item) => {
            if (item.chat.id === chatId) {
              return {
                ...item,
                chat: {
                  ...item.chat,
                  unreadMessages: 0,
                },
              };
            }
            return item;
          })
        );
        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );
  }, [queryClient]);

  useEffect(() => {
    if (chat) {
      markChatAsRead();
      removeUnreadCount();
    }
  }, [chat, removeUnreadCount]);

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
        const assets = result.assets.map((asset) => ({
          id: asset.fileName?.split('.')[0],
          extension: asset.fileName?.split('.')[1],
          uri: asset.uri,
        })) as SourceWithId[];

        if (medias.length) {
          const uniqueAssets = assets.filter(
            (newAsset) => !medias.some((image) => image.id === newAsset.id)
          );
          setMedias((prevImages) => [...prevImages, ...uniqueAssets]);
        } else {
          setMedias(assets);
        }
      }
    }
  };

  const deleteImage = useCallback(
    (source: Source) => {
      if (!source) return;

      setMedias((prev) => prev.filter((image) => image.uri !== source.uri));
    },
    [medias]
  );

  function clearImages() {
    setMedias([]);
  }

  const parseFromContentToChat = (content: ChatContent): ChatMessage => {
    let message = '';
    if (content.system && content.action) {
      message =
        parseContentAction(content.action, content.author) ||
        'WARNING: DEFAULT MESSAGE';
    } else {
      message = content.message?.content || '';
    }
    return {
      _id: content.id,
      text: message,
      system: content.system,
      createdAt: new Date(content.createdAt),
      user: {
        _id: content.author.id,
        name: content.author.name,
        avatar: content.author.avatar?.includes(env.RAW_API_URL)
          ? content.author.avatar
          : createPath(content.author.avatar) || avatarPlaceholder,
      },
      medias:
        content.message?.media && content.message.media.urls
          ? content.message.media.urls
          : [],
    };
  };

  const parseFromAPIToChat = (message: Message): ChatMessage => {
    return {
      _id: message.id,
      text: message.content,
      createdAt: new Date(message.createdAt),
      user: {
        _id: message.user.id,
        name: message.user.name,
        avatar: message.user.avatar?.includes(env.RAW_API_URL)
          ? message.user.avatar
          : createPath(message.user.avatar) || avatarPlaceholder,
      },
      medias: message.media ? message.media.map((m) => m.url) : [],
      received: true,
      sent: true,
    };
  };

  const {
    mutateAsync: deleteMessageRequest,
    isPending: isPendingDeleteMessage,
  } = useMutation({
    mutationKey: ['deleteMessage'],
    mutationFn: async (messageId: string) => {
      const data = await makeGraphQLRequest<DeleteMessageMutation>({
        document: DELETE_MESSAGE,
        variables: {
          messageId,
          chatId,
        },
      });
      return data.deleteMessage;
    },
  });

  const {
    fetchNextPage,
    data,
    isLoading: isLoadingMessages,
  } = useInfiniteQuery({
    queryKey: ['messages', chatId],
    queryFn: async ({ pageParam }) => {
      const data = await makeGraphQLRequest<GetChatMessagesQuery>({
        document: GET_CHAT_MESSAGES,
        variables: {
          chatId: chatId,
          page: pageParam,
        },
      });
      return (data.getChatMessages || []).map((i) =>
        parseFromContentToChat(i as ChatContent)
      );
    },
    getNextPageParam: (lastPage, page) => {
      if (!lastPage || !lastPage.length || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return page.length;
    },
    initialPageParam: 0,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const { mutateAsync: send, isPending: isPendingSend } = useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: async ({
      content,
      medias,
    }: {
      content?: string;
      medias?: string[];
    }) => {
      const data = await makeGraphQLRequest<SendMessageMutation>({
        document: SEND_MESSAGE_IN_CHAT,
        variables: {
          content,
          chatId: chatId,
          medias: medias,
        },
      });
      return data.sendMessage;
    },
  });

  const appendMessage = useCallback(
    (message: IMessage) => {
      queryClient.setQueryData(
        ['messages', chatId],
        (oldData: InfiniteData<IMessage[]> | undefined) => {
          if (!oldData) return oldData;

          const pages = oldData.pages || [];
          const firstPage = pages[0] || [];

          const recentIds = new Set([
            ...firstPage.slice(0, CHECK_LIMIT).map((m) => m._id),
            ...(pages[1]?.slice(0, CHECK_LIMIT).map((m) => m._id) || []),
          ]);

          if (recentIds.has(message._id)) return oldData;

          const newFirstPage = [message, ...firstPage].slice(0, PAGE_LIMIT);

          return {
            ...oldData,
            pages: [newFirstPage, ...pages.slice(1)],
          };
        }
      );
    },
    [queryClient, chatId]
  );

  const onSend = useCallback(
    async (data: IMessage) => {
      try {
        Keyboard.dismiss();
        setIsPendingChatSend(true);
        const urls: string[] = [];

        if (medias.length) {
          try {
            const filesToUpload = medias.filter(
              (item) => item && item.extension
            );

            const uploadedUrls = await uploadFiles(
              filesToUpload.map((i) => ({
                id: i.id,
                extension: i.extension,
                url: i.uri,
                source: MediaSource.Default,
              }))
            );

            urls.push(...uploadedUrls);
          } catch (e) {
            Toast.show({
              type: 'error',
              text1: 'Erro',
              text2: 'Erro ao enviar o anexo.',
            });
            console.error('CHAT - MEDIA ERRO - ', e);
            return;
          }
        }

        // 🔹 Enviar a mensagem para a API
        try {
          const rawMessage = await send({
            content: data.text || '',
            medias: urls,
          });

          const message = parseFromAPIToChat(rawMessage);
          appendMessage(message);
          clearImages();
          setText('');
        } catch (e) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Não foi possível enviar a mensagem.',
          });
          console.error('CHAT - SEND ERRO - ', e);
        }
      } finally {
        setIsPendingChatSend(false);
      }
    },
    [medias, uploadFiles, send, appendMessage, clearImages]
  );

  const onMediaLongPress = useCallback(
    (media: SourceWithId, message: IMessage) => {
      setSelectedMessage(message);
      sheetRef.current?.present();
    },
    [sheetRef]
  );

  const onLongPress = useCallback(
    (context: unknown, message: IMessage) => {
      sheetRef.current?.present();
      setSelectedMessage(message);
    },
    [sheetRef]
  );

  const clearSelectedMessage = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  const deleteMessage = useCallback(
    (messageId: string) => {
      let latestMessage: ChatMessage | null = null;
      let isSingleMessage: boolean | null = null;
      queryClient.setQueryData(
        ['messages', chatId],
        (oldData: InfiniteData<ChatMessage[]>) => {
          if (!oldData) return oldData;
          const p = oldData.pages?.flat(1);
          const index = p.findIndex((item) => item._id === messageId);
          if (index === 0) {
            if (p[index + 1]) {
              latestMessage = p[index + 1];
              isSingleMessage = !p[index + 1];
            }
          }
          const updatedPages = (oldData.pages || []).map((page) => {
            return page.filter((item) => item._id !== messageId);
          });
          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
      queryClient.setQueryData(
        ['allChats'],
        (oldData: InfiniteData<GetAllChatsQuery['getAllChats']>) => {
          if (!oldData) return oldData;
          const updatedPages = oldData.pages.map((page) =>
            page.map((item) => {
              if (item.chat.id === chatId) {
                if (latestMessage) {
                  return {
                    ...item,
                    message: {
                      id: latestMessage._id,
                      content: latestMessage.text,
                      createdAt: latestMessage.createdAt,
                      hasMedia:
                        latestMessage.medias &&
                        latestMessage.medias.length &&
                        latestMessage?.medias?.length > 0,
                      user: {
                        id: latestMessage.user._id,
                        name: latestMessage.user.name,
                        avatar: latestMessage.user.avatar,
                      },
                    },
                  };
                } else if (isSingleMessage) {
                  return {
                    chat: {
                      ...item.chat,
                    },
                    message: {
                      id: `${Math.random() * 1000}-${Date.now().toString()}`,
                      createdAt: item.chat.createdAt,
                      content: null,
                      hasMedia: false,
                      user: {
                        id: user?.me.id,
                        name: user?.me.name,
                      },
                    },
                  };
                }
              }
              return item;
            })
          );
          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },
    [queryClient, chatId]
  );

  const handleSubData = useCallback(
    async (data: ActiveChatSubscription | null) => {
      if (!data) return;

      await markChatAsRead();
      removeUnreadCount();
      if (data.activeChat.message) {
        if (data.activeChat.message.deletedAt) {
          deleteMessage(data.activeChat.message.id);
        } else {
          const message = parseFromAPIToChat(data.activeChat.message);
          appendMessage(message);
        }
      }
      if (data.activeChat.chatAction) {
        const message = parseFromContentToChat({
          author: (data.activeChat.chatAction.action !== 'ADD'
            ? data.activeChat.chatAction.user!
            : data.activeChat.chatAction.actionAuthor!) as BaseUser,
          system: true,
          createdAt: data.activeChat.chatAction.createdAt,
          id: data.activeChat.chatAction.id,
          message: {
            content: parseContentAction(
              data.activeChat.chatAction as ContentAction,
              data.activeChat.chatAction.actionAuthor!
            ) as string,
            hasMedia: false,
          },
        });
        appendMessage(message);
        queryClient.setQueryData(['activeChat', chatId], (oldData: Chat) => {
          if (!oldData) return oldData;
          return {
            ...data.activeChat.chat,
            isAdmin: oldData.isAdmin,
          };
        });
        queryClient.setQueryData(['chatDetails', chatId], (oldData: Chat) => {
          if (!oldData) return oldData;
          return {
            ...data.activeChat.chat,
            isAdmin: oldData.isAdmin,
          };
        });

        if (data.activeChat.chatAction.action === 'CHAT_UPDATE') {
          if (data.activeChat.chat.ownerId !== chat?.ownerId) {
            queryClient.setQueryData(
              ['chatMembers', chatId],
              (oldData: InfiniteData<ChatMember[]>) => {
                return {
                  ...oldData,
                  pages: oldData.pages.map((page) =>
                    page.map((member) => {
                      if (member.user.id === data.activeChat.chat.ownerId) {
                        return {
                          ...member,
                          isAdmin: true,
                        };
                      }
                      return member;
                    })
                  ),
                };
              }
            );
          }
          if (data.activeChat.chat) {
            queryClient.setQueryData(
              ['chatDetails', chatId],
              (oldData: GetChatByIdQuery['getChatById']) => {
                if (!oldData) return oldData;
                return {
                  ...oldData,
                  ...data.activeChat.chat,
                  isAdmin:
                    oldData.isAdmin ??
                    user?.me.id === data.activeChat.chat.ownerId,
                };
              }
            );
          }
        }

        if (data.activeChat.chatAction.action === 'USER_ROLE_UPDATE') {
          if (data.activeChat.chatAction.user?.id === user?.me.id) {
            queryClient.setQueryData(
              ['activeChat', chatId],
              (oldData: GetChatByIdQuery['getChatById']) => {
                if (!oldData) return oldData;
                return {
                  ...oldData,
                  isAdmin: data.activeChat.chatAction?.user?.isAdmin,
                };
              }
            );
            queryClient.setQueryData(
              ['chatDetails', chatId],
              (oldData: GetChatByIdQuery['getChatById']) => {
                return {
                  ...oldData,
                  isAdmin: data.activeChat.chatAction?.user?.isAdmin,
                };
              }
            );
          }
          queryClient.setQueryData(
            ['chatMembers', chatId],
            (current: InfiniteData<ChatMember[]>) => {
              return {
                ...current,
                pages: current.pages.map((page) => {
                  return page.map((member) => {
                    if (
                      member.user.id === data.activeChat.chatAction?.user?.id
                    ) {
                      return {
                        ...member,
                        isAdmin: !member.isAdmin,
                      };
                    }
                    return member;
                  });
                }),
              };
            }
          );
        }

        if (data.activeChat.chatAction.action === 'ADD') {
          await queryClient.refetchQueries({
            queryKey: ['chatMembers', chatId],
          });
          await queryClient.refetchQueries({
            queryKey: ['activeChat', chatId],
          });
          await queryClient.refetchQueries({
            queryKey: ['chatDetails', chatId],
          });
        }

        if (
          data.activeChat.chatAction.action === 'REMOVE' ||
          data.activeChat.chatAction.action === 'LEAVE'
        ) {
          queryClient.setQueryData(
            ['chatMembers', chatId],
            (oldData: InfiniteData<ChatMember[]>) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page) =>
                  page.filter(
                    (member) =>
                      member.user.id !== data.activeChat.chatAction?.user?.id
                  )
                ),
              };
            }
          );
          if (data.activeChat.chatAction.user?.id === user?.me.id) {
            queryClient.setQueryData(
              ['allChats'],
              (oldData: InfiniteData<Chat[]>) => {
                if (!oldData) return oldData;
                const updatedPages = oldData.pages.map((page) =>
                  page.filter((item) => item.id !== chatId)
                );
                return {
                  ...oldData,
                  pages: updatedPages,
                };
              }
            );
          }
        }

        if (
          data.activeChat.chatAction.action === 'REMOVE' &&
          isFocused &&
          data.activeChat.chat.id === chatId &&
          data.activeChat.chatAction.user?.id === user?.me.id
        ) {
          Toast.show({
            type: 'info',
            text1: 'Você foi removido do chat',
          });
          navigation.navigate('Communications');
        }
      }
    },
    [queryClient]
  );

  useSubscription<ActiveChatSubscription, { chatId: string }>({
    request: {
      query: ACTIVE_CHAT_SUB,
      variables: {
        chatId,
      },
    },
    connectionParams: {
      isTracking: false,
      isStatus: false,
    },
    onData: handleSubData,
    enabled: true,
  });

  const handleDeleteMessage = useCallback(async () => {
    if (!selectedMessage) return;
    try {
      await deleteMessageRequest(selectedMessage._id as string);
      deleteMessage(selectedMessage._id as string);
      Toast.show({
        type: 'success',
        text1: 'Mensagem apagada com sucesso.',
      });
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Falha ao apagar a mensagem',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Falha ao apagar a mensagem',
        text2: 'Tente novamente mais tarde',
      });
    }
    clearSelectedMessage();
  }, [selectedMessage]);

  const handleOnlineStatus = useCallback(
    (data: FriendStatusSubscription['friendStatus']) => {
      if (!chat) return;
      if (!chat.isDirect) return;
      queryClient.setQueryData(
        ['activeChat', chatId],
        (oldData: GetChatByIdQuery['getChatById']) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isOnline: data.online,
          };
        }
      );
    },
    [chat, queryClient]
  );

  useFriendsStatus({
    cb: handleOnlineStatus,
  });

  useEffect(() => {
    if (!fetchNextPage) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchNextPage();
    }
  }, [fetchNextPage]);

  const handleDeleteAlert = () => {
    Alert.alert(
      'Apagar mensagem?',
      'Tem certeza que deseja apagar esta mensagem? Essa ação não poderá ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Apagar',
          onPress: handleDeleteMessage,
        },
      ]
    );
  };

  useRefetchOnAppFocus([
    ['activeChat', chatId],
    ['messages', chatId],
    ['chatMembers', chatId],
  ]);

  return {
    handleGallery,
    medias,
    deleteImage,
    clearImages,
    onSend,
    messages: data?.pages.flat() ?? [],
    user: user?.me,
    chat,
    isLoading: isLoadingChat || isLoadingMessages,
    isLoadingMessages,
    navigation,
    fetchNextPage,
    theme,
    text,
    setText,
    sheetRef,
    onLongPress,
    selectedMessage,
    clearSelectedMessage,
    handleDeleteAlert,
    isPendingDeleteMessage,
    isPending: isPendingChatSend || isPendingUpload || isPendingSend,
    onMediaLongPress,
  };
}
