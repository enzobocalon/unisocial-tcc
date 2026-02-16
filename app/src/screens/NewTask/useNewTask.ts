import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from 'styled-components';
import { z } from 'zod';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import {
  CreateAssignmentTaskMutation,
  GetTaskQuery,
  UpdateAssignmentTaskMutation,
} from '../../__generated__/graphql';
import { GET_TASK } from '../../services/assignments/queries/getTask';
import { CREATE_TASK } from '../../services/assignments/mutations/createTask';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';
import Toast from 'react-native-toast-message';
import { UPDATE_TASK } from '../../services/assignments/mutations/updateAssignmentTask';
import { formatDateWithTime } from '../../utils/dateFormat';

const schema = z.object({
  name: z
    .string({ required_error: 'Esse campo é obrigatório.' })
    .min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  dueDate: z
    .string({
      required_error: 'Esse campo é obrigatório.',
    })
    .min(1, 'A data é obrigatória'),
});

type Schema = z.infer<typeof schema>;

export function useNewTask(
  assignmentId: string,
  taskId?: string,
  selectedUsers?: string[]
) {
  const navigation = useNavigation<StackProps>();
  const queryClient = useQueryClient();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const theme = useTheme();

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => setIsDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    setDueDate(date.toISOString());
    hideDatePicker();
    setValue('dueDate', date.toISOString());
  };

  function formatDate(isoString: string) {
    // Importar a função centralizada de formatação
    return formatDateWithTime(isoString);
  }

  const { data: task, isLoading } = useQuery({
    queryKey: ['getTask', taskId],
    queryFn: async () => {
      const data = await makeGraphQLRequest<GetTaskQuery>({
        document: GET_TASK,
        variables: { taskId },
      });
      setDueDate(data.getTask.dueDate);
      return data.getTask;
    },
    enabled: !!taskId,
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: task?.description || '',
      name: task?.name || '',
      dueDate: task?.dueDate || '',
    },
  });

  const { mutateAsync: createTaskFn, isPending: isPendingCreate } = useMutation(
    {
      mutationKey: ['createTask'],
      mutationFn: async (content: Schema & { users: string[] }) => {
        const data = await makeGraphQLRequest<CreateAssignmentTaskMutation>({
          document: CREATE_TASK,
          variables: {
            ...content,
            assignmentId,
          },
        });
        return data.createAssignmentTask;
      },
    }
  );

  const { mutateAsync: updateTaskFn, isPending: isPendingUpdate } = useMutation(
    {
      mutationKey: ['createTask'],
      mutationFn: async (content: Schema) => {
        if (!taskId) return;
        const data = await makeGraphQLRequest<UpdateAssignmentTaskMutation>({
          document: UPDATE_TASK,
          variables: {
            ...content,
            taskId,
          },
        });
        return data.updateAssignmentTask;
      },
    }
  );

  const handleSubmitData = handleSubmit(async (formData) => {
    const { dueDate, name, description } = formData;
    if (taskId) {
      try {
        const task = await updateTaskFn({
          name,
          description,
          dueDate,
        });
        if (!task) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao atualizar a tarefa',
            text2: 'Tente novamente mais tarde.',
          });
          return;
        }
        queryClient.setQueryData(
          ['getTask', taskId],
          (oldData: GetTaskQuery['getTask']) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              name: task.name,
              description: task.description,
              dueDate: task.dueDate,
            };
          }
        );
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: ['getAllTasksByAssignmentId', { assignmentId }],
          }),
          queryClient.refetchQueries({
            queryKey: ['getUserTasksByAssignmentId', { assignmentId }],
          }),
          queryClient.refetchQueries({
            queryKey: ['allAssignments'],
          }),
        ]);
        navigation.navigate('Task', {
          taskId,
        });
      } catch (e: any) {
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao criar tarefa',
            text2: e.message,
          });
          return;
        }
        Toast.show({
          type: 'error',
          text1: 'Erro ao criar tarefa',
          text2: 'Tente novamente mais tarde.',
        });
      }

      return;
    }

    if (!selectedUsers) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar tarefa',
        text2: 'Selecione pelo menos 1 usuário para criar a tarefa',
      });
      return;
    }
    try {
      const task = await createTaskFn({
        name,
        description,
        dueDate,
        users: selectedUsers,
      });
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ['getAllTasksByAssignmentId', { assignmentId }],
        }),
        queryClient.refetchQueries({
          queryKey: ['getUserTasksByAssignmentId', { assignmentId }],
        }),
        queryClient.refetchQueries({
          queryKey: ['allAssignments'],
        }),
      ]);
      navigation.navigate('Task', {
        taskId: task.id,
      });
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao criar tarefa',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar tarefa',
        text2: 'Tente novamente mais tarde.',
      });
    }
  });

  return {
    theme,
    showDatePicker,
    handleConfirm,
    isDatePickerVisible,
    dueDate,
    formatDate,
    control,
    handleSubmitData,
    errors,
    isLoading,
    task,
    isPending: isPendingCreate || isPendingUpdate,
  };
}
