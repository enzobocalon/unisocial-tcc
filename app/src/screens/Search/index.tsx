import * as S from './styles';
import ScreenHeader from '../../components/ScreenHeader';
import { Search as SearchIcon } from '../../components/Icons/Search';
import { Text } from '../../components/Text';
import { CircledCross } from '../../components/Icons/CircledCross';
import { useSearch } from './useSearch';
import { UserCard } from '../../components/Cards/Users/User';
import { FlatList } from 'react-native';
import { TouchableOpacity, View } from 'react-native';
import { ArrowTopLeft } from '../../components/Icons/ArrowTopLeft';

export function Search() {
  const {
    theme,
    search,
    setSearch,
    data,
    onSearchSubmit,
    storeUserHistory,
    clearHistory,
    history,
    usersData,
    navigate,
  } = useSearch(true);
  return (
    <S.Container>
      <ScreenHeader
        renderMidComponent={() => (
          <S.SearchInputContainer>
            <SearchIcon />
            <S.SearchInput
              placeholder="Buscar"
              value={search}
              onChangeText={(e) => setSearch(e)}
              enterKeyHint="search"
              onSubmitEditing={() => onSearchSubmit(search)}
              style={{
                color: '#333',
              }}
              cursorColor={theme.colors.blue}
              placeholderTextColor={theme.colors.lightGray}
            />
          </S.SearchInputContainer>
        )}
        renderRightComponent={() => <View></View>}
      />

      {data && (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.white,
            marginTop: 1,
          }}
        >
          <S.RecentActions>
            <Text size={18} weight="Bold" color={theme.colors.blue}>
              Resultados
            </Text>
          </S.RecentActions>
          {data && data.length > 0 && (
            <FlatList
              data={data}
              showsVerticalScrollIndicator={false}
              style={{
                flexGrow: 0,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 16,
                  }}
                  onPress={() => storeUserHistory(item.id)}
                >
                  <S.RecentCard>
                    <UserCard user={item} horizontal />
                    <ArrowTopLeft />
                  </S.RecentCard>
                </TouchableOpacity>
              )}
            />
          )}
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              marginTop: data && data.length > 0 ? 32 : 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            activeOpacity={0.7}
            onPress={() => onSearchSubmit(search)}
          >
            <Text color={theme.colors.blue} weight="Semibold">
              Ver mais sobre{' '}
              <Text weight="Bold" color={theme.colors.blue}>
                {search}
              </Text>
            </Text>
            <ArrowTopLeft />
          </TouchableOpacity>
        </View>
      )}

      {(history.users.length > 0 || history.posts.length > 0) && !data && (
        <S.RecentContainer>
          <S.RecentActions>
            <Text size={18} weight="Bold" color={theme.colors.blue}>
              Recentes
            </Text>

            <S.CrossButton activeOpacity={0.7} onPress={clearHistory}>
              <CircledCross size={20} color={theme.colors.gray} />
            </S.CrossButton>
          </S.RecentActions>
          <FlatList
            data={usersData}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                }}
                activeOpacity={0.7}
                onPress={() => {
                  navigate.navigate('UserProfile', {
                    userId: item.id,
                  });
                }}
              >
                <UserCard user={item} />
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              flexGrow: 0,
            }}
          />
          <FlatList
            data={history.posts}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item === '') return null;
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    padding: 16,
                  }}
                  onPress={() =>
                    navigate.navigate('DeepSearch', { query: item })
                  }
                >
                  <S.RecentCard>
                    <Text weight="Semibold">{item}</Text>
                    <ArrowTopLeft />
                  </S.RecentCard>
                </TouchableOpacity>
              );
            }}
          />
        </S.RecentContainer>
      )}
      {!history.users.length && !history.posts.length && !data && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <Text align="center" weight="Semibold" size={18}>
            Histórico vazio.
          </Text>
          <Text align="center">
            Use a caixa de busca para começar a pesquisar.
          </Text>
        </View>
      )}
    </S.Container>
  );
}
