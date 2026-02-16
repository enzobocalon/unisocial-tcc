import {
  Composer,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  Actions,
  ActionsProps,
  ComposerProps,
  SendProps,
  Send as GFSend,
  BubbleProps,
  Bubble as GFBubble,
  SystemMessageProps,
  SystemMessage,
  DayProps,
} from 'react-native-gifted-chat';
import { Dimensions, View } from 'react-native';
import { Image } from '../../../../components/Icons/Image';
import { PaperPlane } from '../../../../components/Icons/PaperPlane';
import { ChatMessage } from '../../../../types/ChatMessage';
import { MediaGrid } from '../../../../components/Medias/MediaGrid';
import { createPath } from '../../../../utils/path';
import { Text } from '../../../../components/Text';
import { Checks } from '../../../../components/Icons/Checks';
import { Loading } from '../../../../components/Loading';

interface ExtendedSend extends SendProps<IMessage> {
  isPending?: boolean;
}

// Container do input
export const renderComposer = (props: ComposerProps) => {
  return (
    <Composer
      {...props}
      textInputStyle={{
        color: '#333',
        marginLeft: 0,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: '#f3f6f7',
      }}
      multiline
      placeholder="Digite sua mensagem..."
      placeholderTextColor="#667781"
    />
  );
};

export const renderInput = (props: InputToolbarProps<IMessage>) => (
  <InputToolbar
    {...props}
    containerStyle={{
      paddingHorizontal: 4,
      backgroundColor: '#f3f6f7', // theme.colors.fields
      borderRadius: 12,
      marginHorizontal: 8,
      marginBottom: 8,
      elevation: 2,
    }}
  />
);

export const Action = (props: ActionsProps) => (
  <Actions
    {...props}
    containerStyle={{
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginHorizontal: 4,
      marginLeft: 4,
    }}
    icon={() => <Image size={20} />}
    optionTintColor="#222B45"
  />
);

export const Send = (props: ExtendedSend) => {
  return (
    <GFSend
      {...props}
      containerStyle={{
        backgroundColor: '#075093', // theme.colors.blue
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 999,
        marginLeft: 4,
        marginBottom: 2,
      }}
      disabled={props.isPending}
      sendButtonProps={{
        ...props.sendButtonProps,
        onPress: () => {
          if (props.onSend) {
            props.onSend({ text: props.text }, true);
          }
        },
      }}
    >
      {props.isPending ? <Loading /> : <PaperPlane color="white" />}
    </GFSend>
  );
};

export const Bubble = (props: BubbleProps<ChatMessage>) => {
  const hasMedia = props.currentMessage?.medias![0] != null || false;
  const sources = props.currentMessage.medias
    ? props.currentMessage.medias?.map((media) => ({
        id: media as string,
        url: createPath(media) as string,
      }))
    : [];
  const shouldRenderTicks = props.currentMessage.user._id === props.user?._id;
  return (
    <GFBubble
      {...props}
      onLongPress={props.onLongPress}
      wrapperStyle={{
        left: {
          backgroundColor: '#f3f6f7',
        },
        right: {
          backgroundColor: '#075093',
        },
      }}
      renderTicks={() => {
        if (!shouldRenderTicks) return;

        return (
          <View
            style={{
              flexDirection: 'row',
              marginRight: 10,
              alignItems: 'center',
              maxWidth: 16,
              height: 14,
            }}
          >
            <Checks size={18} color={'white'} />
          </View>
        );
      }}
      renderCustomView={() =>
        hasMedia &&
        sources.length && (
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 8,
            }}
          >
            <MediaGrid
              sources={sources}
              width={Dimensions.get('window').width * 0.75}
              shouldCreatePath={false}
              onItemLongPress={() => {
                if (props.onLongPress) {
                  props.onLongPress(undefined, props.currentMessage);
                }
              }}
            />
          </View>
        )
      }
    />
  );
};

export const renderSystemMessage = (props: SystemMessageProps<IMessage>) => {
  return (
    <SystemMessage
      {...props}
      textStyle={{
        color: '#667781', // theme.colors.lightGray
        fontSize: 14,
      }}
    />
  );
};

export const Day = (props: DayProps<IMessage>) => {
  function isSameDay(
    currentMessage: IMessage,
    diffMessage: IMessage | null | undefined
  ) {
    if (!diffMessage || !diffMessage.createdAt) {
      return false;
    }

    const currentDate = new Date(currentMessage.createdAt);
    const diffDate = new Date(diffMessage.createdAt);

    if (isNaN(currentDate.getTime()) || isNaN(diffDate.getTime())) {
      return false;
    }

    return (
      currentDate.getFullYear() === diffDate.getFullYear() &&
      currentDate.getMonth() === diffDate.getMonth() &&
      currentDate.getDate() === diffDate.getDate()
    );
  }

  const formatDay = () => {
    const isValidDate = (date) => !isNaN(new Date(date).getTime());
    const rawDate = props.currentMessage.createdAt;

    const date = isValidDate(rawDate) ? new Date(rawDate) : new Date(); // Use a data atual como fallback

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return 'Hoje';
    } else if (isYesterday) {
      return 'Ontem';
    } else {
      const day = date.getDate();
      const month = date.toLocaleString('pt-BR', { month: 'long' });
      const year = date.getFullYear();
      return `${day} de ${month} de ${year}`;
    }
  };

  if (
    props.currentMessage == null ||
    isSameDay(props.currentMessage, props.previousMessage)
  ) {
    return null;
  }

  return (
    <View
      style={{
        alignItems: 'center',
        marginVertical: 8,
      }}
    >
      <View>
        <Text size={14} color="#667781">
          {formatDay()}
        </Text>
      </View>
    </View>
  );
};
