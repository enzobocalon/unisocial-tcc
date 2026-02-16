import { FlatList, RefreshControl, View } from 'react-native';
import ScreenHeader from '../../../components/ScreenHeader';
import { Text } from '../../../components/Text';
import * as S from './styles';
import { Group } from '../../../components/Icons/Group';
import { useNewChat } from './useNewChat';
import { Avatar } from '../../../components/Avatar';
import { Search } from '../../../components/Icons/Search';
import { Loading } from '../../../components/Loading';

export function NewChat() {
  const {
    theme,
    data,
    searchVal,
    setSearchVal,
    handleChatClick,
    fetchNextPage,
    navigation,
    handleSearch,
    hasMoreSearchPages,
    searchPage,
    isLoading,
    refreshing,
    onRefresh,
    isPendingCreateChat,
    clickedUser,
  } = useNewChat();

  return (
    <S.Container>
      <ScreenHeader
        renderBackButton
        renderRightComponent={() => <View></View>}
        text="Conversas"
      />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Loading color={theme.colors.blue} size={40} />
        </View>
      ) : (
        <>
          <S.Wrapper>
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
                      onPress={() => handleChatClick(friend.id)}
                      disabled={isPendingCreateChat}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          // minHeight: 32,
                        }}
                      >
                        <Avatar source={friend.avatar} size={40} />
                        <Text weight="Semibold" size={18}>
                          {friend.name}
                        </Text>
                      </View>
                      {!isPendingCreateChat && clickedUser === friend.id && (
                        <Loading color={theme.colors.blue} />
                      )}
                    </S.Button>
                  ))}
                </View>
              );
            }}
            onEndReached={async () => {
              if (searchVal) {
                if (hasMoreSearchPages) {
                  await handleSearch(searchVal, searchPage + 1);
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
              flexGrow: 1,
            }}
            ListHeaderComponent={() => (
              <>
                <Text
                  color={theme.colors.lightGray}
                  weight="Semibold"
                  style={{ marginBottom: 2 }}
                >
                  Ações
                </Text>
                <S.Button
                  onPress={() =>
                    navigation.navigate('UserSelection', {
                      isAssignment: false,
                      isTask: false,
                      reset: true,
                    })
                  }
                  style={{
                    justifyContent: 'flex-start',
                  }}
                >
                  <S.IconBorder>
                    <Group color="white" size={24} />
                  </S.IconBorder>
                  <Text size={18} weight="Semibold">
                    Criar novo grupo
                  </Text>
                </S.Button>
                <Text
                  color={theme.colors.lightGray}
                  weight="Semibold"
                  style={{ marginVertical: 16 }}
                >
                  Seus Amigos
                </Text>
              </>
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text weight="Semibold" numberOfLines={1}>
                  Nenhum amigo encontrado.
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.blue]}
              />
            }
          />
        </>
      )}
    </S.Container>
  );
}
