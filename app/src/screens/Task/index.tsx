import { StackScreenProps } from '@react-navigation/stack';
import { Text } from '../../components/Text';
import * as S from './styles';
import { StackParams } from '../../types/Navigation';
import { useTask } from './useTask';

import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { TaskHeader } from './components/Header';
import { Exit } from '../../components/Icons/Exit';
import { File } from '../../components/Icons/File';
import { AssignmentTask } from '../../__generated__/graphql';
import { TaskMemberCard } from './components/MemberCard';
import { Trash } from '../../components/Icons/Trash';
import { BottomSheet } from '../../components/BottomSheet';
import { Loading } from '../../components/Loading';
import { Cross } from '../../components/Icons/Cross';

type Props = StackScreenProps<StackParams, 'Task'>;

export function Task({ route }: Props) {
  const {
    handleDeleteAlert,
    theme,
    task,
    isLoading,
    members,
    assignment,
    user,
    handleLeaveAlert,
    bottomSheetRef,
    handleUserSelection,
    setSelectedUser,
    navigation,
    handleDeleteUserAlert,
    refreshing,
    onRefresh,
    hasNextPage,
    fetchNextPage,
    isPendingDelete,
    isPendingLeave,
    isPendingRemove,
  } = useTask(route.params.taskId);

  const isAdmin = assignment?.isAdmin || task?.ownerId === user?.me.id;

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Loading size={56} color={theme.colors.blue} />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <TaskMemberCard
            data={item}
            onPress={() => handleUserSelection(item.userId)}
          />
        )}
        style={{
          backgroundColor: 'white',
        }}
        ListHeaderComponent={() => <TaskHeader task={task as AssignmentTask} />}
        contentContainerStyle={{ backgroundColor: 'white' }}
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
            <S.Row
              style={{
                paddingHorizontal: 16,
                justifyContent: 'space-between',
                marginTop: 16,
              }}
            >
              <Text weight="Semibold" size={18}>
                Ações
              </Text>
            </S.Row>

            <S.Row>
              <S.ActionButton
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('Files', {
                    taskId: task!.id,
                    assignmentId: task!.assignmentId,
                  })
                }
              >
                <File size={18} />
                <Text size={18}>Ver todos os arquivos</Text>
              </S.ActionButton>
            </S.Row>
            <S.Row>
              {task?.isMember && (
                <S.ActionButton
                  onPress={handleLeaveAlert}
                  activeOpacity={0.7}
                  disabled={isPendingLeave}
                >
                  {isPendingLeave ? (
                    <>
                      <Loading size={18} color={theme.colors.error.primary} />
                      <Text size={18} color={theme.colors.error.primary}>
                        Carregando...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Exit size={18} color={theme.colors.error.primary} />
                      <Text size={18} color={theme.colors.error.primary}>
                        Sair
                      </Text>
                    </>
                  )}
                </S.ActionButton>
              )}
            </S.Row>
            <S.Row>
              {(assignment?.isAdmin || task?.ownerId === user?.me.id) && (
                <S.ActionButton
                  onPress={handleDeleteAlert}
                  activeOpacity={0.7}
                  disabled={isPendingDelete}
                >
                  {isPendingDelete ? (
                    <>
                      <Loading size={18} color={theme.colors.error.primary} />
                      <Text size={18} color={theme.colors.error.primary}>
                        Carregando...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Trash size={18} color={theme.colors.error.primary} />
                      <Text size={18} color={theme.colors.error.primary}>
                        Apagar
                      </Text>
                    </>
                  )}
                </S.ActionButton>
              )}
            </S.Row>
          </>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.blue]}
          />
        }
      />
      <BottomSheet ref={bottomSheetRef} onDismiss={() => setSelectedUser(null)}>
        <View>
          {isAdmin && (
            <S.BottomSheetButton
              onPress={handleDeleteUserAlert}
              disabled={isPendingRemove}
            >
              {isPendingRemove ? (
                <>
                  <Loading size={18} color={theme.colors.error.primary} />
                  <Text size={18} color={theme.colors.error.primary}>
                    Carregando...
                  </Text>
                </>
              ) : (
                <>
                  <Trash size={18} color={theme.colors.error.primary} />
                  <Text size={18} color={theme.colors.error.primary}>
                    Remover
                  </Text>
                </>
              )}
            </S.BottomSheetButton>
          )}
          <S.BottomSheetButton
            onPress={() => bottomSheetRef.current?.dismiss()}
          >
            <Cross />
            <Text>Cancelar</Text>
          </S.BottomSheetButton>
        </View>
      </BottomSheet>
    </>
  );
}
