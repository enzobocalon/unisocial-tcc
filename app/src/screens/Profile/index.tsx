import * as S from './styles';
import { TabBar } from '../../components/TabBar';
import { Tabs } from 'react-native-collapsible-tab-view';
import { ProfilePosts } from './components/Posts';
import { Header } from './components/Header';
import { useProfile } from './useProfile';
import { useTheme } from 'styled-components';
import { Loading } from '../../components/Loading';
import { BottomTabParams } from '../../types/Navigation';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BaseUser } from '../../__generated__/graphql';
import { View } from 'react-native';

type ProfileProps =
  | BottomTabScreenProps<BottomTabParams, 'Profile'>
  | { route: { params: { userId: string } } };

export function Profile({ route }: ProfileProps) {
  const { userId } = route.params;
  const { data, isLoading, refetch, onTabChanged } = useProfile(userId);
  const theme = useTheme();

  if (isLoading || !data) {
    return (
      <S.Container>
        <Loading size="large" color={theme.colors.blue} />
      </S.Container>
    );
  }

  async function handleRefresh() {
    await refetch();
}

  return (
    <TabBar
      renderHeader={() => <Header user={data as BaseUser} />}
      onTabChange={(data) =>
        onTabChanged(data.tabName as 'POSTS' | 'LIKES' | 'MEDIAS')
      }
      containerStyle={{ backgroundColor: 'white' }}
    >
      <Tabs.Tab name="POSTS" label={'PUBLICAÇÕES'}>
        <ProfilePosts
          type="POSTS"
          userId={userId}
          onHeaderRefresh={handleRefresh}
        />
      </Tabs.Tab>
      <Tabs.Tab name="LIKES" label={'CURTIDAS'}>
        <ProfilePosts
          type="LIKES"
          userId={userId}
          onHeaderRefresh={handleRefresh}
        />
      </Tabs.Tab>
      <Tabs.Tab name="MEDIAS" label={'MÍDIAS'}>
        <ProfilePosts
          type="MEDIAS"
          userId={userId}
          onHeaderRefresh={handleRefresh}
        />
      </Tabs.Tab>
    </TabBar>
  );
}
