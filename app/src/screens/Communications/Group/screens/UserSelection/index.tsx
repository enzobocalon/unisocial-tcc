import { FlatList, RefreshControl, View } from 'react-native';
import { HorizontalUserList } from '../../../../../components/HorizontalUserList';
import ScreenHeader from '../../../../../components/ScreenHeader';
import { Text } from '../../../../../components/Text';
import * as S from './styles';
import { Avatar } from '../../../../../components/Avatar';
import { useUserSelection } from './useUserSelection';
import { Search } from '../../../../../components/Icons/Search';
import { TouchableOpacity } from 'react-native';
import { LeftArrow } from '../../../../../components/Icons/LeftArrow';
import { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { Check } from '../../../../../components/Icons/Check';
import { FloatingButton } from '../../../../../components/FloatingButton';
import { RightArrow } from '../../../../../components/Icons/RightArrow';
import { StackParams } from '../../../../../types/Navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { BaseUser } from '../../../../../types/User';

interface IUser extends BaseUser {
  user: BaseUser;
}

type ScreenProps = StackScreenProps<StackParams, 'UserSelection'>;

export function UserSelection({ route }: ScreenProps) {
  const {
    data,
    fetchNextPage,
    handleUserClick,
    setSearchVal,
    searchVal,
    isSearchOpen,
    setIsSearchOpen,
    selectedUsers,
    theme,
    handleNextPage,
    handleSearch,
    hasMoreSearchPages,
    searchPage,
    refreshing,
    onRefresh,
  } = useUserSelection(
    route.params.isAssignment,
    route.params.isTask,
    route.params.assignmentId,
    route.params.reset
  );

  const includeSelf = route.params.includeSelf ?? true;
  return (
    <S.Container>
      <ScreenHeader
        renderBackButton
        renderLeftComponent={() =>
          isSearchOpen ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsSearchOpen(false)}
            >
              <LeftArrow size={20} />
            </TouchableOpacity>
          ) : undefined
        }
        renderMidComponent={() =>
          isSearchOpen ? (
            <S.Wrapper exiting={SlideOutRight} entering={SlideInRight}>
              <S.SearchInputContainer>
                <Search />
                <S.SearchInput
                  placeholder="Pesquisar contato..."
                  value={searchVal!}
                  onChangeText={setSearchVal}
                  placeholderTextColor={theme.colors.lightGray}
                />
              </S.SearchInputContainer>
            </S.Wrapper>
          ) : (
            <Text weight="Bold">Selecione os usuários</Text>
          )
        }
        renderRightComponent={() =>
          isSearchOpen ? (
            <View></View>
          ) : (
            <TouchableOpacity onPress={() => setIsSearchOpen(true)}>
              <Search />
            </TouchableOpacity>
          )
        }
      />
      {selectedUsers.length > 0 && (
        <HorizontalUserList
          text={`Usuários Selecionados (${selectedUsers.length}/${includeSelf ? '49' : '50'})`}
          data={selectedUsers as IUser[]}
          itemCb={handleUserClick}
        />
      )}
      <S.HeaderContainer>
        <Text weight="Semibold" color={theme.colors.lightGray}>
          Seus Amigos
        </Text>
      </S.HeaderContainer>
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
                  activeOpacity={0.7}
                >
                  <View style={{ position: 'relative' }}>
                    <Avatar
                      source={friend.user ? friend.user.avatar : friend.avatar}
                      size={40}
                    />
                    {selectedUsers.find((user) => user.id === friend.id) && (
                      <View
                        style={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          backgroundColor: theme.colors.blue,
                          borderRadius: 999,
                          width: 8,
                          height: 8,
                          padding: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check color="white" />
                      </View>
                    )}
                  </View>
                  <Text weight="Semibold" size={18}>
                    {friend.user ? friend.user.name : friend.name}
                  </Text>
                </S.Button>
              ))}
            </View>
          );
        }}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.blue]}
          />
        }
        contentContainerStyle={{
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
      />

      {selectedUsers.length > 0 && (
        <FloatingButton
          icon={<RightArrow color="white" size={18} />}
          onPress={handleNextPage}
        />
      )}
    </S.Container>
  );
}
