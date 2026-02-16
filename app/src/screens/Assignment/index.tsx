import { StackParams } from '../../types/Navigation';
import { StackScreenProps } from '@react-navigation/stack';
import * as S from './styles';
import { AssignmentHeader } from './components/Header';
import { useAssignment } from './useAssignment';
import ScreenHeader from '../../components/ScreenHeader';
import { View } from 'react-native';
import { TabBar } from '../../components/TabBar';
import { Tabs } from 'react-native-collapsible-tab-view';
import { AllTasks } from './components/AllTasks';
import { UserTasks } from './components/UserTasks';
import { FloatingButton } from '../../components/FloatingButton';

type Props = StackScreenProps<StackParams, 'Assignment'>;

export function Assignment({ route }: Props) {
  const { assignmentId } = route.params;
  const { assignment, isLoading, navigation } = useAssignment(assignmentId);
  if (isLoading) return; // TODO: loading
  return (
    <S.Container>
      <ScreenHeader
        renderBackButton
        goBackFn={() => navigation.navigate('Communications')}
        renderMidComponent={() => <AssignmentHeader data={assignment!} />}
        shouldMidComponentBeCentered={false}
        renderRightComponent={() => <View></View>}
        containerStyle={{
          maxHeight: 56,
        }}
      />
      <TabBar>
        <Tabs.Tab name="yourTasks" label={'Suas Tarefas'}>
          <UserTasks assignmentId={assignmentId} />
        </Tabs.Tab>
        <Tabs.Tab name="allTasks" label={'Todas as Tarefas'}>
          <AllTasks assignmentId={assignmentId} />
        </Tabs.Tab>
      </TabBar>

      <FloatingButton
        onPress={() =>
          navigation.navigate('UserSelection', {
            isAssignment: false,
            isTask: true,
            assignmentId,
            includeSelf: false,
            reset: true,
          })
        }
      />
    </S.Container>
  );
}
