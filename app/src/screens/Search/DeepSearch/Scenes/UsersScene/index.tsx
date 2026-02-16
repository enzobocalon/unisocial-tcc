import { Tabs } from 'react-native-collapsible-tab-view';
import { UserCard } from '../../../../../components/Cards/Users/User';
import { useUsersScene } from './useUsersScene';
import * as S from '../../styles';
import { RefreshControl, TouchableOpacity } from 'react-native';
import { Text } from '../../../../../components/Text';
import { Loading } from '../../../../../components/Loading';

interface UsersSceneProps {
  query: string;
}

export function UsersScene({ query }: UsersSceneProps) {
  const { isLoading, theme, users, navigation, onRefresh, refreshing } =
    useUsersScene(query);
  return (
    <>
      {isLoading ? (
        <S.CenteredContainer>
          <Loading size={56} color={theme.colors.blue} />
        </S.CenteredContainer>
      ) : users?.length === 0 ? (
        <S.CenteredContainer>
          <Text weight="Semibold">Nenhum usuário encontrado.</Text>
          <TouchableOpacity
            style={{
              marginTop: 16,
              marginHorizontal: 4,
            }}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Text weight="Semibold" color={theme.colors.blue}>
              Voltar
            </Text>
          </TouchableOpacity>
        </S.CenteredContainer>
      ) : (
        <Tabs.FlatList
          data={users ?? []}
          keyExtractor={(item) => item!.id}
          contentContainerStyle={{
            padding: 16,
            marginTop: 16,
            gap: 8,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('UserProfile', {
                  userId: item!.id,
                });
              }}
            >
              <UserCard horizontal user={item!} renderFollowButton />
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.blue]}
            />
          }
        />
      )}
    </>
  );
}
