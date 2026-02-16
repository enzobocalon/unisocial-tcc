import { useTheme } from 'styled-components';
import { AssignmentListItem } from '../../../../__generated__/graphql';
import * as S from './styles';
import { Text } from '../../../../components/Text';
import { Task } from '../../../../components/Icons/Task';
import { CompletedTask } from '../../../../components/Icons/TaskCompleted';
import { ErrorTask } from '../../../../components/Icons/TaskError';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../../../types/Navigation';

interface Props {
  task: AssignmentListItem;
  dueDate: string;
  shouldNotRenderCustomIcons?: boolean;
}

export function TaskCard({ task, dueDate, shouldNotRenderCustomIcons }: Props) {
  const theme = useTheme();
  const navigation = useNavigation<StackProps>();

  const isEpochDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return (
      date.getFullYear() === 1970 &&
      date.getMonth() === 0 &&
      date.getDate() === 1
    );
  };

  const getColor = () => {
    const MILLISECONDS_IN_TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

    if (shouldNotRenderCustomIcons) {
      return undefined;
    }

    if (isEpochDate(dueDate)) {
      return {
        primary: theme.colors.success.primary,
        secondary: theme.colors.success.light,
      };
    }

    const due = new Date(dueDate);
    const now = new Date();

    if (now >= due) {
      return {
        primary: theme.colors.error.primary,
        secondary: theme.colors.error.light,
      };
    }
    if (due.getTime() - now.getTime() <= MILLISECONDS_IN_TWO_DAYS) {
      return {
        primary: theme.colors.warning.primary,
        secondary: theme.colors.warning.light,
      };
    }

    return undefined;
  };

  const status = (() => {
    // COMPLETED: data é 1970-01-01
    if (isEpochDate(dueDate)) {
      return 'COMPLETED';
    }

    const due = new Date(dueDate);
    const now = new Date();

    // OVERDUE: data passou
    if (now >= due) {
      return 'OVERDUE';
    }

    // WARNING: menos de 2 dias
    if (due.getTime() - now.getTime() <= 2 * 24 * 60 * 60 * 1000) {
      return 'WARNING';
    }

    return undefined;
  })();

  return (
    <S.Container
      onPress={() => navigation.navigate('Task', { taskId: task.id })}
      android_ripple={{
        color: 'rgba(0, 0, 0, 0.2)',
        foreground: true,
      }}
    >
      <S.IconContainer
        style={{
          backgroundColor: getColor()?.secondary,
          borderWidth: 1,
          borderColor: getColor()?.primary,
        }}
      >
        {shouldNotRenderCustomIcons ? (
          <Task size={20} />
        ) : status === 'COMPLETED' ? (
          <CompletedTask size={20} color={getColor()?.primary} />
        ) : status !== null ? (
          <ErrorTask size={20} color={getColor()?.primary} />
        ) : (
          <Task size={20} />
        )}
      </S.IconContainer>
      <S.Content>
        <Text size={18} numberOfLines={1}>
          {task.name}
        </Text>
        {task.description && (
          <Text numberOfLines={1} size={14}>
            {task.description}
          </Text>
        )}
      </S.Content>
    </S.Container>
  );
}
