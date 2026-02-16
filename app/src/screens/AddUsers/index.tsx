import { StackScreenProps } from '@react-navigation/stack';
import { StackParams } from '../../types/Navigation';
import * as S from './styles';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useAddUsersToChat } from './useAddUsersToChat';
import ScreenHeader from '../../components/ScreenHeader';
import { Search } from '../../components/Icons/Search';
import { Text } from '../../components/Text';
import { Avatar } from '../../components/Avatar';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { LeftArrow } from '../../components/Icons/LeftArrow';
import { HorizontalUserList } from '../../components/HorizontalUserList';
import { BaseUser } from '../../__generated__/graphql';
import { FloatingButton } from '../../components/FloatingButton';
import { UserPlus } from '../../components/Icons/UserPlus';
import { Loading } from '../../components/Loading';

interface IUser extends BaseUser {
  user: BaseUser;
}
type Props = StackScreenProps<StackParams, 'AddUsers'>;

export function AddUsers({ route }: Props) {
  const {
    data,
    fetchNextPage,
    searchVal,
    setSearchVal,
    isSearchOpen,
    setIsSearchOpen,
    selectedUsers,
    handleUserClick,
    handleSearch,
    hasMoreSearchPages,
    searchPage,
    handleAdd,
    theme,
    refreshing,
    onRefresh,
    isLoading,
    isPendingAddUserToAssignment,
    isPendingAddUserToChat,
    isPendingAddUserToTask,
    isPendingSearchByAlph,
    totalUsers,
  } = useAddUsersToChat({
    chatId: route.params.chatId,
    assignmentId: route.params.assignmentId,
    taskId: route.params.taskId,
  });

  const isPending =
    isPendingAddUserToAssignment ||
    isPendingAddUserToChat ||
    isPendingAddUserToTask ||
    isPendingSearchByAlph;


  return (
    <S.Container>
      <ScreenHeader
        renderBackButton
        renderLeftComponent={() =>
          isSearchOpen ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsSearchOpen(false)}
              style={{ marginRight: 8 }}
            >
              <LeftArrow size={20} />
            </TouchableOpacity>
          ) : undefined
        }
        renderMidComponent={() =>
          isSearchOpen ? (
            <Animated.View
              exiting={SlideOutRight}
              entering={SlideInRight}
              style={{ width: '100%' }}
            >
              <S.SearchInputContainer>
                <Search />
                <S.SearchInput
                  placeholder="Pesquisar contato..."
                  value={searchVal!}
                  onChangeText={setSearchVal}
                  placeholderTextColor={theme.colors.lightGray}
                />
              </S.SearchInputContainer>
            </Animated.View>
          ) : (
            <Text weight="Bold">Selecione os usuários</Text>
          )
        }
        renderRightComponent={() =>
          isSearchOpen || isLoading ? (
            <View></View>
          ) : (
            <TouchableOpacity onPress={() => setIsSearchOpen(true)}>
              <Search />
            </TouchableOpacity>
          )
        }
      />
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.colors.white,
            alignItems: 'center',
          }}
        >
          <Loading color={theme.colors.blue} size={56} />
        </View>
      ) : (
        <>
          {selectedUsers.length > 0 && (
            <HorizontalUserList
              text={`Usuários Selecionados (${selectedUsers.length}/${totalUsers})`}
              data={selectedUsers as IUser[]}
              itemCb={handleUserClick}
            />
          )}
          <FlatList
            data={data}
            keyExtractor={(item) => {
              const [letter, friends] = item;
              return letter + friends[0].id;
            }}
            renderItem={({ item }) => {
              const [letter, friends] = item;
              return (
                <View>
                  <Text size={18} weight="Semibold">
                    {letter}
                  </Text>
                  {friends?.map((friend) => (
                    <S.Button
                      key={friend.id}
                      onPress={() => handleUserClick(friend)}
                      disabled={friend.isMember}
                    >
                      <Avatar
                        source={
                          friend.user ? friend.user.avatar : friend.avatar
                        }
                        size={40}
                      />
                      <View>
                        <Text weight="Semibold" size={18}>
                          {friend.user ? friend.user.name : friend.name}
                        </Text>
                        {friend.isMember && (
                          <Text size={14}>
                            Esse usuário já faz parte desse grupo
                          </Text>
                        )}
                      </View>
                    </S.Button>
                  ))}
                </View>
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.blue]}
              />
            }
            onEndReached={async () => {
              if (isSearchOpen) {
                if (hasMoreSearchPages) {
                  await handleSearch(searchVal!, searchPage + 1);
                }
              } else {
                if (!searchVal) {
                  await fetchNextPage();
                }
              }
            }}
            contentContainerStyle={{
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          />

          {selectedUsers.length > 0 && (
            <FloatingButton
              icon={<UserPlus color="white" size={18} />}
              onPress={handleAdd}
              isLoading={isPending}
            />
          )}
        </>
      )}
    </S.Container>
  );
}
