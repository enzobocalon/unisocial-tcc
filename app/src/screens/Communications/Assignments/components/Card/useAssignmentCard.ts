import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../../../../types/Navigation';
import { useTheme } from 'styled-components';

export function useAssignmentCard(dueDate: string) {
  const navigation = useNavigation<StackProps>();
  const theme = useTheme();
  const isCompleted = dueDate.startsWith('1970-01-01');
  const getColor = () => {
    const MILLISECONDS_IN_TWO_DAYS = 2 * 24 * 60 * 60 * 1000; // 2 dias em milissegundos
    const now = new Date();
    const due = new Date(dueDate);
    if (isCompleted) {
      return undefined;
    }
    if (now > due) {
      return theme.colors.error.primary;
    }

    if (due.getTime() - now.getTime() <= MILLISECONDS_IN_TWO_DAYS) {
      return theme.colors.warning.primary;
    }

    return undefined; // Sem cor
  };
  const color = getColor();
  return {
    navigation,
    getColor,
    color,
    theme,
    isCompleted,
  };
}
