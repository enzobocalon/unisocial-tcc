import { StackScreenProps } from '@react-navigation/stack';
import * as S from './styles';
import { StackParams } from '../../types/Navigation';
import ScreenHeader from '../../components/ScreenHeader';
import { ChatHeader } from './components/Header';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  renderInput,
  renderComposer,
  Action,
  Bubble,
  Send,
  renderSystemMessage,
  Day,
} from './components/Items';
import { useChat } from './useChat';
import { ChatFooter } from './components/Footer';
import { View } from 'react-native';
import { Loading } from '../../components/Loading';
import { ActionSheet } from './components/ActionSheet';
import { Text } from '../../components/Text';
import { Avatar } from '../../components/Avatar';

type Props = StackScreenProps<StackParams, 'Chat'>;
// Adicionar useFriendStatus também caso seja direct

export function Chat({ route }: Props) {
  const {
    handleGallery,
    medias,
    deleteImage,
    onSend,
    messages,
    user,
    chat,
    isLoading,
    navigation,
    fetchNextPage,
    theme,
    isLoadingMessages,
    text,
    setText,
    sheetRef,
    onLongPress,
    selectedMessage,
    clearSelectedMessage,
    handleDeleteAlert,
    isPendingDeleteMessage,
    isPending,
  } = useChat(route.params.chatId);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
      >
        <ScreenHeader
          renderBackButton
          goBackFn={() => navigation.navigate('Communications')}
          renderMidComponent={() => (
            <S.Wrapper>
              <Avatar source={null} size={40} />
              <Text size={18} weight="Semibold">
                Carregando...
              </Text>
            </S.Wrapper>
          )}
          shouldMidComponentBeCentered={false}
          renderRightComponent={() => <View></View>}
          containerStyle={{
            maxHeight: 56,
          }}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Loading color={theme.colors.blue} size={36} />
        </View>
      </View>
    );
  }

  return (
    <S.Container>
      <ActionSheet
        ref={sheetRef}
        showDelete={selectedMessage?.user._id === user?.id || !!chat?.isAdmin}
        onDelete={handleDeleteAlert}
        onDismiss={clearSelectedMessage}
        isPending={isPendingDeleteMessage}
      />
      <ScreenHeader
        renderBackButton
        goBackFn={() => navigation.navigate('Communications')}
        renderMidComponent={() => <ChatHeader data={chat!} />}
        shouldMidComponentBeCentered={false}
        renderRightComponent={() => <View></View>}
        containerStyle={{
          maxHeight: 56,
        }}
      />
      <GiftedChat
        messages={messages}
        user={{
          _id: user!.id,
        }}
        // onLongPress={onLongPress}
        text={text}
        onInputTextChanged={(text) => setText(text)}
        renderInputToolbar={renderInput}
        renderAvatarOnTop
        renderActions={(props) => (
          <Action {...props} onPressActionButton={handleGallery} />
        )}
        renderUsernameOnMessage
        renderDay={(props) => <Day {...props} />}
        timeFormat="HH:mm"
        renderComposer={(props) => renderComposer(props)}
        renderSend={(props) => (
          <Send {...props} onSend={onSend} isPending={isPending} />
        )}
        renderBubble={(props) => (
          <Bubble {...props} onLongPress={onLongPress} />
        )}
        maxComposerHeight={100}
        renderChatFooter={() => (
          <ChatFooter medias={medias} onDelete={deleteImage} />
        )}
        alwaysShowSend={medias.length > 0}
        loadEarlier
        infiniteScroll
        renderLoadEarlier={() =>
          isLoadingMessages ? (
            <Loading color={theme.colors.blue} size={32} />
          ) : (
            <View />
          )
        }
        listViewProps={{
          onEndReached: () => {
            fetchNextPage();
          },
          inverted: true,
        }}
        renderSystemMessage={renderSystemMessage}
        keyboardShouldPersistTaps="never"
      />
    </S.Container>
  );
}
