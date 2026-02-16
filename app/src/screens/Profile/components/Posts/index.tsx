import { Tabs } from 'react-native-collapsible-tab-view';
import { useProfilePosts } from './useProfilePosts';
import { Post } from '../../../../components/Post';
import * as S from './styles';
import { Loading } from '../../../../components/Loading';
import { FloatingLoading } from '../../../../components/FloatingLoading';
import { Text } from '../../../../components/Text';
import { RefreshControl } from 'react-native';

interface ProfilePostsProps {
  type: 'POSTS' | 'LIKES' | 'MEDIAS';
  userId: string;
  onHeaderRefresh: () => void;
}

export function ProfilePosts({
  type,
  userId,
  onHeaderRefresh,
}: ProfilePostsProps) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refreshing,
    onRefresh,
    theme,
    hasFetched,
  } = useProfilePosts(type, userId, onHeaderRefresh);

  const isActuallyLoading =
    (!hasFetched && isLoading) || (!data?.length && isLoading);

  if (isActuallyLoading) {
    return (
      <S.CenteredContainer>
        <Loading size="large" color={theme.colors.blue} />
      </S.CenteredContainer>
    );
  }

  return (
    <>
      <Tabs.FlatList
        data={data}
        keyExtractor={(item) => (item as { id: string }).id}
        renderItem={({ item }) => (
          <Post
            post={item}
            shouldOpenReplyBottomSheet
            shouldRenderUserActions={type !== 'LIKES'}
          />
        )}
        initialNumToRender={10}
        onEndReachedThreshold={0.3}
        onEndReached={() => hasNextPage && fetchNextPage()}
        contentContainerStyle={{ backgroundColor: 'white' }}
        ListEmptyComponent={() => (
          <S.CenteredContainer>
            <Text weight="Semibold">Nenhuma publicação encontrada</Text>
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
      <FloatingLoading isLoading={isFetchingNextPage} />
    </>
  );
}
