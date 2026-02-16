import { TouchableOpacity } from 'react-native';
import { Text } from '../../components/Text';
import * as S from './styles';
import { MemberCard } from './components/MemberCard';
import { useChatDetails } from './useChatDetails';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParams } from '../../types/Navigation';
import { FlatList, View } from 'react-native';
import { Exit } from '../../components/Icons/Exit';
import { ChatDetailsHeader } from './components/Header';
import { BottomSheet } from '../../components/BottomSheet';
import { Trash } from '../../components/Icons/Trash';
import { User } from '../../components/Icons/User';
import { Swap } from '../../components/Icons/Swap';
import { Loading } from '../../components/Loading';
import { LeftArrow } from '../../components/Icons/LeftArrow';
import { CaretDoubleUp } from '../../components/Icons/CaretDoubleUp';
import { CaretDoubleDown } from '../../components/Icons/CaretDoubleDown';

type Props = StackScreenProps<StackParams, 'ChatDetails'>;

export function ChatDetails({ route }: Props) {
  const {
    isLoading,
    members,
    hasNextPage,
    fetchNextPage,
    theme,
    bottomSheetRef,
    handleOnPress,
    chat,
    clickedUser,
    user,
    handleRemoveUser,
    handleLeaveChat,
    handleTransferOwnership,
    handleChangeRole,
    navigation,
    isPendingChangeRole,
    isPendingLeaveChat,
    isPendingRemoveUser,
    isPendingTransferOwnership,
    refreshData,
  } = useChatDetails(route.params.chatId);

  if (isLoading) {
    return (
      <S.LoadingContainer>
        <TouchableOpacity
          style={{ padding: 16 }}
          activeOpacity={0.7}
          onPress={navigation.goBack}
        >
          <LeftArrow />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Loading size={40} color={theme.colors.blue} />
        </View>
      </S.LoadingContainer>
    );
  }
  return (
    <>
      <BottomSheet ref={bottomSheetRef} snapPoints={['50%']} useBackdrop>
        <View>
          <S.BottomSheetButton
            onPress={() => {
              navigation.navigate('UserProfile', {
                userId: clickedUser?.user.id as string,
              });
              bottomSheetRef.current?.dismiss();
            }}
          >
            <User />
            <Text>Ver Perfil</Text>
          </S.BottomSheetButton>
          {chat?.ownerId === user.user?.me.id &&
            clickedUser?.user.id !== user.user?.me.id && (
              <S.BottomSheetButton
                onPress={handleChangeRole}
                disabled={isPendingChangeRole}
              >
                {isPendingChangeRole ? (
                  <>
                    <Loading size={16} color={theme.colors.error.primary} />
                    <Text color={theme.colors.error.primary}>
                      Carregando...
                    </Text>
                  </>
                ) : clickedUser?.isAdmin ? (
                  <>
                    <CaretDoubleDown color={theme.colors.error.primary} />
                    <Text color={theme.colors.error.primary}>
                      Retirar Admin
                    </Text>
                  </>
                ) : (
                  <>
                    <CaretDoubleUp color={theme.colors.error.primary} />
                    <Text color={theme.colors.error.primary}>Tornar Admin</Text>
                  </>
                )}
              </S.BottomSheetButton>
            )}
          {chat?.ownerId === user.user?.me.id &&
            clickedUser?.user.id !== user.user?.me.id && (
              <S.BottomSheetButton
                onPress={handleTransferOwnership}
                disabled={isPendingTransferOwnership}
              >
                {isPendingTransferOwnership ? (
                  <>
                    <Loading size={16} color={theme.colors.error.primary} />
                    <Text color={theme.colors.error.primary}>
                      Carregando...
                    </Text>
                  </>
                ) : (
                  <>
                    <Swap color={theme.colors.error.primary} />
                    <Text color={theme.colors.error.primary}>
                      Transferir Liderança
                    </Text>
                  </>
                )}
              </S.BottomSheetButton>
            )}
          {chat &&
            Boolean(chat?.isAdmin) &&
            !chat.isDirect &&
            clickedUser?.user.id !== chat.ownerId &&
            user.user?.me.id !== clickedUser?.user.id && (
              <S.BottomSheetButton
                onPress={handleRemoveUser}
                disabled={isPendingRemoveUser}
              >
                {isPendingRemoveUser ? (
                  <>
                    <Loading size={16} color={theme.colors.error.primary} />
                    <Text color={theme.colors.error.primary}>
                      Carregando...
                    </Text>
                  </>
                ) : (
                  <>
                    <Trash color={theme.colors.error.primary} />
                    <Text color={theme.colors.error.primary}>Remover</Text>
                  </>
                )}
              </S.BottomSheetButton>
            )}
        </View>
      </BottomSheet>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <MemberCard data={item} onPress={() => handleOnPress(item)} />
        )}
        onRefresh={refreshData}
        refreshing={isLoading}
        ListHeaderComponent={<ChatDetailsHeader chat={chat!} />}
        ListFooterComponent={() => (
          <>
            {hasNextPage && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => fetchNextPage()}
              >
                <Text
                  color={theme.colors.blue}
                  weight="Semibold"
                  style={{ paddingHorizontal: 16, paddingTop: 12 }}
                >
                  Carregar mais...
                </Text>
              </TouchableOpacity>
            )}
            <S.ActionsContainer>
              <Text size={18} weight="Semibold">
                Ações
              </Text>
              {chat?.isDirect && (
                <S.Button
                  onPress={() =>
                    navigation.navigate('UserProfile', {
                      userId: chat!.directUserMember as string,
                    })
                  }
                >
                  <User size={18} />
                  <Text size={18}>Ver Perfil</Text>
                </S.Button>
              )}
              {!chat?.isDirect && (
                <S.Button
                  onPress={handleLeaveChat}
                  disabled={isPendingLeaveChat}
                >
                  {isPendingLeaveChat ? (
                    <>
                      <Loading size={16} color={theme.colors.error.primary} />
                      <Text color={theme.colors.error.primary}>
                        Carregando...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Exit color={theme.colors.error.primary} size={18} />
                      <Text size={18} color={theme.colors.error.primary}>
                        Sair
                      </Text>
                    </>
                  )}
                </S.Button>
              )}
            </S.ActionsContainer>
          </>
        )}
        contentContainerStyle={{
          backgroundColor: 'white',
        }}
        style={{
          backgroundColor: 'white',
        }}
      />
    </>
  );
}
