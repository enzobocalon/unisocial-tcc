import { memo } from 'react';
import { FloatingButton } from '../../components/FloatingButton';
import { Post } from '../../components/Post';
import ScreenHeader from '../../components/ScreenHeader';
import * as S from './styles';
import { useHome } from './useHome';
import { Loading } from '../../components/Loading';
import { Tabs } from 'react-native-collapsible-tab-view';
import { TabBar } from '../../components/TabBar';
import { RefreshControl, View } from 'react-native';
import { Text } from '../../components/Text';

const MemoPost = memo(Post, (prevProps, nextProps) => {
  const prevPost = prevProps.post;
  const nextPost = nextProps.post;

  return (
    prevProps.postKey === nextProps.postKey &&
    prevPost.id === nextPost.id &&
    prevPost.liked === nextPost.liked &&
    prevPost.shared === nextPost.shared &&
    prevPost.likes === nextPost.likes &&
    prevPost.shares === nextPost.shares &&
    prevPost.replies === nextPost.replies &&
    prevPost.content === nextPost.content
  );
});

export function Home() {
  const {
    timelineData,
    loadingTimeline,
    theme,
    hasNextPageTimeline,
    fetchNextPageTimeline,
    courseTimeline,
    fetchNextPageCourses,
    hasNextPageCourses,
    isLoadingCourses,
    navigation,
    refreshingTimeline,
    onRefreshTimeline,
    onRefreshCourses,
    refreshingCourses,
  } = useHome();

  return (
    <S.Container>
      <ScreenHeader />
      <TabBar>
        <Tabs.Tab name="Friends" label={'Seus Amigos'}>
          <S.MinView>
            {loadingTimeline ? (
              <S.CenteredContainer>
                <Loading color={theme.colors.blue} size={48} />
              </S.CenteredContainer>
            ) : (
              <Tabs.FlatList
                data={timelineData}
                renderItem={({ item }) => (
                  <MemoPost
                    post={item}
                    postKey={item.key}
                    shouldOpenReplyBottomSheet
                  />
                )}
                initialNumToRender={50}
                keyExtractor={(item) => item.key ?? item.id}
                onEndReached={() => {
                  if (hasNextPageTimeline) {
                    fetchNextPageTimeline();
                  }
                }}
                onEndReachedThreshold={0.1}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshingTimeline}
                    onRefresh={onRefreshTimeline}
                    colors={[theme.colors.blue]}
                  />
                }
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text weight="Semibold" size={20} align="center">
                      Nenhuma publicação encontrada.
                    </Text>
                  </View>
                )}
              />
            )}
          </S.MinView>
        </Tabs.Tab>
        <Tabs.Tab name="Course" label={'Seu Curso'}>
          <S.MinView>
            {isLoadingCourses ? (
              <S.CenteredContainer>
                <Loading color={theme.colors.blue} size={48} />
              </S.CenteredContainer>
            ) : (
              <Tabs.FlatList
                data={courseTimeline}
                renderItem={({ item }) => (
                  <MemoPost
                    post={item}
                    postKey={item.key}
                    shouldOpenReplyBottomSheet
                  />
                )}
                initialNumToRender={50}
                keyExtractor={(item) => item.key ?? item.id}
                onEndReached={() => {
                  if (hasNextPageCourses) {
                    fetchNextPageCourses();
                  }
                }}
                onEndReachedThreshold={0.1}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshingCourses}
                    onRefresh={onRefreshCourses}
                    colors={[theme.colors.blue]}
                  />
                }
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text weight="Semibold" size={20} align="center">
                      Nenhuma publicação encontrada.
                    </Text>
                  </View>
                )}
              />
            )}
          </S.MinView>
        </Tabs.Tab>
      </TabBar>
      <FloatingButton
        onPress={() => {
          navigation.navigate('Publish', {
            isSharing: false,
          });
        }}
      />
    </S.Container>
  );
}
