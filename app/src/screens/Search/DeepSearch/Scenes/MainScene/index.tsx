import { RefreshControl, TouchableOpacity } from 'react-native';
import * as S from '../../styles';
import { FullUserCard } from '../../../../../components/Cards/Users/FullUser';
import { Text } from '../../../../../components/Text';
import { Post } from '../../../../../components/Post';
import { CollapsibleRef, Tabs } from 'react-native-collapsible-tab-view';
import { useMainScene } from './useMainScene';
import { memo } from 'react';
import { FlatList } from 'react-native';
import { Loading } from '../../../../../components/Loading';

const MemoFullUserCard = memo(FullUserCard);
const MemoPost = memo(Post);

interface Props {
  query: string;
  barRef: React.RefObject<CollapsibleRef>;
}

export function MainScene({ query, barRef }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    users,
    posts,
    navigation,
    theme,
    onRefresh,
    refreshing,
  } = useMainScene(query);

  if (isLoading) {
    return (
      <S.CenteredContainer>
        <Loading size={56} color={theme.colors.blue} />
      </S.CenteredContainer>
    );
  }

  if (!users || !posts || (users.length === 0 && posts.length === 0)) {
    return (
      <S.CenteredContainer>
        <Text weight="Semibold">Nenhum item encontrado.</Text>
        <TouchableOpacity
          style={{ marginTop: 16, marginHorizontal: 4 }}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text weight="Bold" color={theme.colors.blue}>
            Voltar
          </Text>
        </TouchableOpacity>
      </S.CenteredContainer>
    );
  }

  return (
    <Tabs.FlatList
      data={posts}
      keyExtractor={(item) => (posts[0] != null ? item!.id : 'empty')}
      ListHeaderComponent={() => {
        if (data && data.pages && users && users?.length > 0)
          return (
            <S.Wrapper
              style={{
                padding: 16,
              }}
            >
              <Text
                size={20}
                weight="Semibold"
                style={{
                  marginVertical: 8,
                }}
              >
                Pessoas
              </Text>
              <FlatList
                data={users}
                keyExtractor={(item) => item!.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      marginHorizontal: 4,
                    }}
                    activeOpacity={0.7}
                    onPress={() => {
                      navigation.navigate('UserProfile', {
                        userId: item!.id,
                      });
                    }}
                  >
                    <MemoFullUserCard user={item!} />
                  </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
              <TouchableOpacity
                style={{
                  marginTop: 16,
                  marginHorizontal: 4,
                }}
                activeOpacity={0.7}
                onPress={() => barRef.current?.jumpToTab('PESSOAS')}
              >
                <Text weight="Semibold" color={theme.colors.blue}>
                  Ver mais
                </Text>
              </TouchableOpacity>
            </S.Wrapper>
          );
      }}
      renderItem={({ item }) =>
        item ? (
          <S.Wrapper>
            <MemoPost
              post={item!}
              postKey={item!.key}
              shouldReplyNavigateToPostPage
            />
          </S.Wrapper>
        ) : (
          <S.CenteredContainer
            style={{
              flex: 1,
              marginTop: 48,
            }}
          >
            <Text weight="Semibold" numberOfLines={1}>
              Nenhuma publicação encontrada.
            </Text>
          </S.CenteredContainer>
        )
      }
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={() => (
        <S.CenteredContainer
          style={{
            flex: 1,
            marginTop: 48,
          }}
        >
          <Text weight="Semibold" numberOfLines={1}>
            Nenhuma publicação encontrada.
          </Text>
        </S.CenteredContainer>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.blue]}
        />
      }
    />
  );
}
