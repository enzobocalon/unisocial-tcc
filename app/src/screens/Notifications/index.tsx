import { Text } from '../../components/Text';
import ScreenHeader from '../../components/ScreenHeader';
import * as S from './styles';
import { StatusNotification } from '../../components/Cards/Notifications/StatusNotification';
import { FriendRequestNotification } from '../../components/Cards/Notifications/FriendRequest';
import { TabBar } from '../../components/TabBar';
import { Tabs } from 'react-native-collapsible-tab-view';
import { useNotification } from './useNotifications';
import { Notification } from '../../__generated__/graphql';
import { Loading } from '../../components/Loading';
import { FloatingLoading } from '../../components/FloatingLoading';
import { RefreshControl } from 'react-native';

export function Notifications() {
  const {
    notifications,
    hasMoreNotifications,
    fetchMoreNotifications,
    isLoadingNotifications,
    isFetchingMoreNotifications,
    theme,
    fetchMoreFriendRequests,
    friendRequests,
    hasMoreFriendRequests,
    isFetchingMoreFriendRequests,
    isLoadingFriendRequests,
    onRefreshNotification,
    onRefreshRequests,
    refreshingNotification,
    refreshingRequests,
  } = useNotification();

  return (
    <S.Container>
      <ScreenHeader
        renderMidComponent={() => <Text weight="Bold">Notificações</Text>}
      />
      <TabBar>
        <Tabs.Tab name="Notifications" label="Notificações">
          <S.MinView>
            {isLoadingNotifications ? (
              <S.CenteredContainer>
                <Loading color={theme.colors.blue} size={48} />
              </S.CenteredContainer>
            ) : (
              <>
                <Tabs.FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <StatusNotification notification={item as Notification} />
                  )}
                  onEndReached={async () => {
                    if (hasMoreNotifications) {
                      await fetchMoreNotifications();
                    }
                  }}
                  onEndReachedThreshold={0.3}
                  ListEmptyComponent={() => (
                    <S.CenteredContainer>
                      <Text weight="Semibold" numberOfLines={1}>
                        Nenhuma notificação encontrada.
                      </Text>
                    </S.CenteredContainer>
                  )}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshingNotification}
                      onRefresh={onRefreshNotification}
                      colors={[theme.colors.blue]}
                    />
                  }
                />
                <FloatingLoading isLoading={isFetchingMoreNotifications} />
              </>
            )}
          </S.MinView>
        </Tabs.Tab>
        <Tabs.Tab name="Solicitations" label="Solicitações">
          <S.MinView>
            {isLoadingFriendRequests ? (
              <S.CenteredContainer>
                <Loading color={theme.colors.blue} size={48} />
              </S.CenteredContainer>
            ) : (
              <>
                <Tabs.FlatList
                  data={friendRequests}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <FriendRequestNotification
                      notification={item as Notification}
                    />
                  )}
                  onEndReached={async () => {
                    if (hasMoreFriendRequests) {
                      await fetchMoreFriendRequests();
                    }
                  }}
                  ListEmptyComponent={() => (
                    <S.CenteredContainer>
                      <Text weight="Semibold" numberOfLines={1}>
                        Nenhuma solicitação encontrada.
                      </Text>
                    </S.CenteredContainer>
                  )}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshingRequests}
                      onRefresh={onRefreshRequests}
                      colors={[theme.colors.blue]}
                    />
                  }
                  onEndReachedThreshold={0.3}
                />
                <FloatingLoading isLoading={isFetchingMoreFriendRequests} />
              </>
            )}
          </S.MinView>
        </Tabs.Tab>
      </TabBar>
    </S.Container>
  );
}
