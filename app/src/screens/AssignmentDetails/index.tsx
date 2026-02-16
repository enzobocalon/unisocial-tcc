import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import * as S from './styles';
import { AssignmentDetailsHeader } from './components/Header';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParams } from '../../types/Navigation';
import { Text } from '../../components/Text';
import { Chat } from '../../components/Icons/Chat';
import { Exit } from '../../components/Icons/Exit';
import { useAssignmentDetails } from './useAssignmentDetails';
import { MemberCard } from '../ChatDetails/components/MemberCard';
import { ChatSlash } from '../../components/Icons/ChatSlash';
import { BottomSheet } from '../../components/BottomSheet';
import { User } from '../../components/Icons/User';
import { CaretDoubleDown } from '../../components/Icons/CaretDoubleDown';
import { CaretDoubleUp } from '../../components/Icons/CaretDoubleUp';
import { Swap } from '../../components/Icons/Swap';
import { Trash } from '../../components/Icons/Trash';
import { Loading } from '../../components/Loading';

type Props = StackScreenProps<StackParams, 'AssignmentDetails'>;

export function AssignmentDetails({ route }: Props) {
  const {
    theme,
    members,
    fetchNextPage,
    hasNextPage,
    data,
    isLoading,
    handleUnlinkAlert,
    navigate,
    handleLeaveAssignmentAlert,
    refresh,
    isRefreshing,
    bottomSheetRef,
    clickedUser,
    handleUserClick,
    setClickedUser,
    handleChangeRole,
    user,
    handleTransferOwnership,
    handleRemoveUser,
    handleDeleteAssignment,
    isPendingUnlinkChat,
    isPendingLeaveAssignment,
    isPendingTransferOwnership,
    isPendingRemoveUser,
    isPendingDeleteAssignment,
    isPendingUpdateRole,
  } = useAssignmentDetails(route.params.assignmentId);

  if (isLoading) return;

  return (
    <S.Container>
      <BottomSheet
        ref={bottomSheetRef}
        useBackdrop
        snapPoints={['50%']}
        onDismiss={() => setClickedUser(null)}
      >
        <View
        // flex: 1,
        >
          <S.BottomSheetButton
            onPress={() => {
              if (!clickedUser) return;
              navigate.navigate('UserProfile', {
                userId: clickedUser.userId,
              });
              bottomSheetRef.current?.dismiss();
            }}
          >
            <User />
            <Text>Ver Perfil</Text>
          </S.BottomSheetButton>
          {data?.ownerId === user?.me.id &&
            clickedUser?.userId !== user?.me.id && (
              <S.BottomSheetButton
                onPress={handleChangeRole}
                disabled={isPendingUpdateRole}
              >
                {isPendingUpdateRole ? (
                  <>
                    <Loading color={theme.colors.error.primary} />
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
          {data?.ownerId === user?.me.id &&
            clickedUser?.userId !== user?.me.id && (
              <S.BottomSheetButton
                onPress={handleTransferOwnership}
                disabled={isPendingTransferOwnership}
              >
                {isPendingTransferOwnership ? (
                  <Loading color={theme.colors.error.primary} />
                ) : (
                  <Swap color={theme.colors.error.primary} />
                )}
                <Text color={theme.colors.error.primary}>
                  {isPendingTransferOwnership
                    ? 'Carregando...'
                    : 'Transferir Liderança'}
                </Text>
              </S.BottomSheetButton>
            )}
          {data?.isAdmin &&
            clickedUser?.userId !== user?.me.id &&
            data.ownerId !== clickedUser?.userId && (
              <S.BottomSheetButton
                onPress={handleRemoveUser}
                disabled={isPendingRemoveUser}
              >
                {isPendingRemoveUser ? (
                  <Loading color={theme.colors.error.primary} />
                ) : (
                  <Trash color={theme.colors.error.primary} />
                )}
                <Text color={theme.colors.error.primary}>
                  {isPendingRemoveUser ? 'Carregando...' : 'Remover'}
                </Text>
              </S.BottomSheetButton>
            )}
        </View>
      </BottomSheet>
      <FlatList
        data={members}
        style={{
          backgroundColor: 'white',
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[theme.colors.blue]}
          />
        }
        renderItem={({ item }) => (
          <MemberCard data={item} onPress={() => handleUserClick(item)} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <AssignmentDetailsHeader assignment={data!} />
        )}
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

              {data?.isAdmin && !data.chatId && (
                <S.Button
                  activeOpacity={0.7}
                  onPress={() =>
                    navigate.navigate('LinkableChats', {
                      assignmentId: data.id,
                    })
                  }
                >
                  <Chat size={18} />
                  <Text size={18}>Vincular Chat</Text>
                </S.Button>
              )}
              {data?.isAdmin && data.chatId && (
                <S.Button
                  activeOpacity={0.7}
                  onPress={handleUnlinkAlert}
                  disabled={isPendingUnlinkChat}
                >
                  {isPendingUnlinkChat ? (
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Loading color={'#333'} size={18} />
                    </View>
                  ) : (
                    <ChatSlash size={18} />
                  )}
                  <Text size={18}>
                    {isPendingUnlinkChat ? 'Carregando...' : 'Desvincular Chat'}
                  </Text>
                </S.Button>
              )}
              {data?.ownerId !== user?.me.id && (
                <S.Button
                  activeOpacity={0.7}
                  onPress={handleLeaveAssignmentAlert}
                  disabled={isPendingLeaveAssignment}
                >
                  {isPendingLeaveAssignment ? (
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Loading color={theme.colors.error.primary} size={18} />
                    </View>
                  ) : (
                    <Exit size={18} color={theme.colors.error.primary} />
                  )}
                  <Text size={18} color={theme.colors.error.primary}>
                    {isPendingLeaveAssignment ? 'Carregando...' : 'Sair'}
                  </Text>
                </S.Button>
              )}
              {data?.ownerId === user?.me.id && (
                <S.Button
                  activeOpacity={0.7}
                  onPress={handleDeleteAssignment}
                  disabled={isPendingDeleteAssignment}
                >
                  {isPendingDeleteAssignment ? (
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Loading color={theme.colors.error.primary} size={18} />
                    </View>
                  ) : (
                    <Trash size={18} color={theme.colors.error.primary} />
                  )}
                  <Text size={18} color={theme.colors.error.primary}>
                    {isPendingDeleteAssignment ? 'Carregando...' : 'Apagar'}
                  </Text>
                </S.Button>
              )}
            </S.ActionsContainer>
          </>
        )}
      />
    </S.Container>
  );
}
