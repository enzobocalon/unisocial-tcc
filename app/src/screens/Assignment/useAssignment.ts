import { useQuery } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_ASSIGNMENT_BY_ID } from '../../services/assignments/queries/getAssignmentById';
import { GetAssignmentByIdQuery } from '../../__generated__/graphql';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';
import { useRefetchOnAppFocus } from '../../hooks/useRefetchOnAppFocus';
import Toast from 'react-native-toast-message';

export function useAssignment(assignmentId: string) {
  const navigation = useNavigation<StackProps>();
  const { data: assignment, isLoading } = useQuery({
    queryKey: ['getAssignment', assignmentId],
    queryFn: async () => {
      try {
        const data = await makeGraphQLRequest<GetAssignmentByIdQuery>({
          document: GET_ASSIGNMENT_BY_ID,
          variables: {
            assignmentId,
          },
        });
        return data.getAssignmentById;
      } catch (e: any) {
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Falha ao navegar para a tarefa.',
            text2: e.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Falha ao navegar para a tarefa.',
            text2: 'Tente novamente mais tarde.',
          });
        }
        navigation.goBack();
      }
    },
  });

  useRefetchOnAppFocus([
    ['getAssignment', assignmentId],
    ['getAssignmentUsers', assignmentId],
    ['getUserTasksByAssignmentId', { assignmentId }],
    ['getAllTasksByAssignmentId', { assignmentId }],
  ]);

  return {
    assignment,
    isLoading: isLoading,
    navigation,
  };
}
