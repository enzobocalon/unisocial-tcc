import { View } from 'react-native';
import { AssignmentListItem } from '../../../../../__generated__/graphql';
import { Text } from '../../../../../components/Text';
import * as S from './styles';
import { Avatar } from '../../../../../components/Avatar';
import { useAssignmentCard } from './useAssignmentCard';
import { Warning } from '../../../../../components/Icons/Warning';

interface Props {
  assignment: AssignmentListItem;
  dueDate: string;
  taskCount?: number;
}

export function AssignmentCard({ assignment, dueDate, taskCount }: Props) {
  const { navigation, color, theme, isCompleted } = useAssignmentCard(dueDate);
  return (
    <S.Container
      android_ripple={{
        color: 'rgba(0, 0, 0, 0.2)',
        foreground: true,
      }}
      onPress={() => {
        navigation.navigate('Assignment', {
          assignmentId: assignment.id,
        });
      }}
    >
      <View>
        <Avatar
          source={assignment.icon}
          size={40}
          style={{ borderRadius: 9999 }}
          useGroupPlaceholder
        />
      </View>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <S.Content>
          <Text
            weight={assignment.isPending ? 'Semibold' : 'Regular'}
            size={18}
            color={color}
            numberOfLines={1}
            style={{ flex: 1, marginRight: 8 }}
          >
            {assignment.name}
          </Text>
          {color && <Warning color={color} size={18} />}
        </S.Content>
        <S.ContentContainer>
          <S.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!isCompleted && (
              <Text
                size={14}
                weight={assignment.isPending ? 'Semibold' : 'Regular'}
                color={color}
                numberOfLines={1}
              >
                {taskCount
                  ? `Você possui ${taskCount} tarefa(s) para essa data`
                  : assignment.isPending &&
                    assignment.pendingCount &&
                    assignment.pendingCount > 0
                    ? `Você possui ${assignment.pendingCount} tarefa(s) para essa data`
                    : assignment.dueDate}
              </Text>
            )}
          </S.Content>
        </S.ContentContainer>
      </View>
    </S.Container>
  );
}
