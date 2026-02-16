import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { StackProps } from '../../../types/Navigation';
import { useTheme } from 'styled-components';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GET_COURSES } from '../../../services/courses/queries/getCourses';
import {
  Course,
  GetCoursesQuery,
  SignupMutation,
} from '../../../__generated__/graphql';
import { SIGNUP } from '../../../services/auth/mutations/signup';
import Toast from 'react-native-toast-message';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  makeGraphQLRequest,
  makeGraphQLRequestWithTimeout,
} from '../../../lib/graphQLClient';

const schema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, { message: 'Nome deve ter ao menos 2 caracteres' }),
  email: z
    .string({ required_error: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' })
    .refine(
      (email) => {
        return email.split('@')[1] === 'unifev.edu.br';
      },
      {
        message: 'Seu e-mail deve ser da Unifev.',
      }
    ),
  RA: z.coerce
    .number({
      required_error: 'RA é obrigatório',
      invalid_type_error: 'RA deve ser um número válido',
    })

    .min(1, { message: 'RA deve ter ao menos 1 caractere' }),
  username: z
    .string({ required_error: 'Nome de usuário é obrigatório' })
    .min(3, { message: 'Nome de usuário deve ter ao menos 3 caracteres' }),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
  courseId: z.string({ required_error: 'Curso é obrigatório' }).min(3).uuid(),
});

type SignUpForm = z.infer<typeof schema>;

export function useSignup() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(schema),
  });
  const { isLoading: pickerLoading, data: rawItems } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const data = await makeGraphQLRequest<GetCoursesQuery>({
        document: GET_COURSES,
      });
      return data.getCourses;
    },
  });
  const { mutateAsync, isPending: loading } = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (data: { data: SignUpForm }) => {
      return makeGraphQLRequestWithTimeout(
        makeGraphQLRequest<SignupMutation>({
          document: SIGNUP,
          variables: data,
        })
      );
    },
  });
  const navigation = useNavigation<StackProps>();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [pickerValue, setPickerValue] = useState('');

  const items = useMemo(() => {
    if (!rawItems) return [];
    return rawItems.map((course: Course) => {
      return {
        label: course.name,
        value: course.id,
      };
    });
  }, [rawItems]);

  const handleOnChangePicker = (
    data: string,
    onChange: (...event: unknown[]) => void
  ) => {
    setPickerValue(data);
    onChange(data);
  };
  const handleSignup = handleSubmit(async (formData) => {
    try {
      const validRA = Number(formData.RA);
      if (isNaN(validRA)) {
        return;
      }
      const { signup: data } = await mutateAsync({
        data: {
          ...formData,
          courseId: pickerValue,
          RA: validRA,
        },
      });

      if (!data) {
        throw new Error('Erro ao finalizar o cadastro.');
      }
      Toast.show({
        type: data.success ? 'success' : 'error',
        text1: data.message!,
      });
      navigation.navigate('Signin');
    } catch (err: any) {
      if (err.message === 'Request timed out') {
        Toast.show({
          type: 'error',
          text1: 'Requisição expirou.',
          text2: 'Tente novamente mais tarde.',
        });
      }
      if (err instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao finalizar o cadastro.',
          text2: err.message,
        });
        console.error(err);
      }
    }
  });

  return {
    control,
    handleSignup,
    errors,
    navigation,
    theme,
    items,
    open,
    setOpen,
    pickerLoading,
    loading,
    handleOnChangePicker,
  };
}
