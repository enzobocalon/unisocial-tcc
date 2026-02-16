import {
  BaseUser,
  Chat,
  ChatActionEntity,
  ChatActionEnum,
  ContentAction,
  Message,
} from '../__generated__/graphql';
import { useAuth } from '../context/AuthContext';

export function useChatParser() {
  const { user } = useAuth();
  const parseChatAction = (chatAction: ChatActionEntity) => {
    // TODO: requer mais testes
    switch (chatAction.action) {
      case ChatActionEnum.Add:
        if (!chatAction.message) {
          return `${chatAction.actionAuthor?.name} adicionou ${chatAction.user?.name}`;
        }
        return chatAction.message;
      case ChatActionEnum.Remove:
        return `${chatAction.actionAuthor.name} removeu ${chatAction.user?.name}`;
      case ChatActionEnum.ChatUpdate:
        return `${chatAction.actionAuthor?.name} atualizou o grupo`;
      case ChatActionEnum.Create:
        return `${chatAction.actionAuthor?.name} criou o grupo`;
      case ChatActionEnum.Leave:
        return `${chatAction.actionAuthor?.name} saiu do grupo`;
      case ChatActionEnum.UserRoleUpdate:
        return `${chatAction.actionAuthor?.name} atualizou o cargo de ${chatAction?.user?.name}`;
      case ChatActionEnum.Delete:
        return `${chatAction.actionAuthor?.name} apagou a mensagem de ${chatAction?.user?.name}`;
      case ChatActionEnum.Join:
        return `${chatAction.actionAuthor?.name} entrou no grupo`;
      case ChatActionEnum.AssignmentLink:
        return `${chatAction.actionAuthor?.name} vinculou uma atividade`;
      case ChatActionEnum.AssignmentUnlink:
        return `${chatAction.actionAuthor?.name} desvinculou uma atividade`;
    }
  };

  const parseContentAction = (action: ContentAction, author: BaseUser) => {
    switch (action.action) {
      case ChatActionEnum.Add:
        return action.message;
      case ChatActionEnum.Remove:
        return `${author.name} removeu ${action.user?.name}`;
      case ChatActionEnum.ChatUpdate:
        return `${action.user?.name} atualizou o grupo`;
      case ChatActionEnum.Create:
        return `${action.user?.name} criou o grupo`;
      case ChatActionEnum.Leave:
        return `${action.user?.name} saiu do grupo`;
      case ChatActionEnum.UserRoleUpdate:
        return `${author.name} atualizou o cargo de ${action.user?.name}`;
      case ChatActionEnum.Join:
        return `${action.user?.name} entrou no grupo`;
      case ChatActionEnum.AssignmentLink:
        return `${author.name} vinculou uma atividade`;
      case ChatActionEnum.AssignmentUnlink:
        return `${author.name} desvinculou uma atividade`;
    }
  };

  const parseMessage = (message: Message, chat: Chat) => {
    if (message.content === null) {
      return null;
    }
    if (chat.isDirect) {
      return message.content;
    }

    if (message.user?.id === user?.me.id) {
      if (message.content) {
        return 'Você: ' + message.content;
      } else if (message.hasMedia) {
        return 'Você enviou uma mídia';
      }
    }
    return `${message.user?.name}: ${message.content ? message.content : 'enviou uma mídia'}`;
  };

  return {
    parseChatAction,
    parseMessage,
    parseContentAction,
  };
}
