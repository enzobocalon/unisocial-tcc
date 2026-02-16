import { useEffect, useState } from 'react';
import { ChatMessageSub } from '../../../../../__generated__/graphql';
import { useChatParser } from '../../../../../hooks/useChatParser';
import { formatToExactDate } from '../../../../../utils/dateFormat';
import { useTheme } from 'styled-components';
import { useAuth } from '../../../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../../../../types/Navigation';
import { useQueryClient } from '@tanstack/react-query';

export function useChatCard(res: ChatMessageSub) {
  const theme = useTheme();
  const { user } = useAuth();
  const { parseChatAction, parseMessage } = useChatParser();
  const [data, setData] = useState(() => formatData(res));
  const navigate = useNavigation<StackProps>();
  const queryClient = useQueryClient();

  function formatData(data: ChatMessageSub) {
    const content = data.chatAction
      ? parseChatAction(data.chatAction)
      : data.message
        ? parseMessage(data.message, data.chat)
        : null;
    const icon = data.chat.icon;
    const date = formatToExactDate(
      data.chatAction
        ? data.chatAction.createdAt
        : data.message?.createdAt ?? ''
    );
    const unread = data.chat.unreadMessages
      ? data.chat.unreadMessages > 0
      : false;
    const title = data.chat.name;
    const isOnline = data.chat.isOnline ? data.chat.isOnline : null;
    const isSelf = data.message?.user.id === user?.me.id;
    const isDirect = data.chat.isDirect;
    const hasMedia = data.message?.hasMedia;
    const shouldRenderMediaIcon = data.message
      ? !data.message.content && data.message.hasMedia
      : false;

    return {
      content,
      date,
      title,
      icon,
      unread,
      isOnline,
      isSelf,
      isDirect,
      hasMedia,
      shouldRenderMediaIcon,
    };
  }

  useEffect(() => {
    setData(formatData(res));
  }, [res]);

  async function handleNavigation(chatId: string) {
    await Promise.all([
      queryClient.refetchQueries({
        queryKey: ['activeChat', chatId],
      }),
      queryClient.refetchQueries({
        queryKey: ['messages', chatId],
      }),
    ]);
    navigate.navigate('Chat', {
      chatId,
    });
  }

  return {
    data,
    theme,
    navigate,
    handleNavigation,
  };
}
