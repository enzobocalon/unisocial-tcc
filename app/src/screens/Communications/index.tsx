import { Tabs } from 'react-native-collapsible-tab-view';
import ScreenHeader from '../../components/ScreenHeader';
import { TabBar } from '../../components/TabBar';
import * as S from './styles';
import { Chats } from './Chats';
import { Assignments } from './Assignments';
import { View } from 'react-native';

export function Communications() {
  return (
    <S.Container>
      <ScreenHeader
        renderRightComponent={() => <View></View>}
        renderBackButton
      />
      <TabBar>
        <Tabs.Tab name="chat" label={'Chats'}>
          <S.MinView>
            <Chats />
          </S.MinView>
        </Tabs.Tab>
        <Tabs.Tab name="assignments" label={'Atividades'}>
          <S.MinView>
            <Assignments />
          </S.MinView>
        </Tabs.Tab>
      </TabBar>
    </S.Container>
  );
}
