import {
  isGraphQLErrorResponse,
  makeGraphQLRequest,
  makeGraphQLRequestWithTimeout,
} from '../../../lib/graphQLClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { StackProps } from '../../../types/Navigation';
import { useTheme } from 'styled-components';
import { SIGNIN } from '../../../services/auth/mutations/signin';
import { useAuth } from '../../../context/AuthContext';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';
import { SigninMutation } from '../../../__generated__/graphql';

const schema = z.object({
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
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
});

type SigninForm = z.infer<typeof schema>;

export function useSignin() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: zodResolver(schema),
  });
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['signin'],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return makeGraphQLRequestWithTimeout(
        makeGraphQLRequest<SigninMutation>({
          document: SIGNIN,
          variables: {
            email,
            password,
          },
        })
      );
    },
  });

  const navigation = useNavigation<StackProps>();
  const theme = useTheme();
  const { signin } = useAuth();

  const handleSignin = handleSubmit(async (formData) => {
    const { email, password } = formData;
    try {
      const { signin: data } = await mutateAsync({
        email,
        password,
      });
      if (!data) {
        throw new Error('Erro ao fazer login');
      }
      const { token, refreshToken } = data;
      signin(token, refreshToken);
      Toast.show({
        type: 'success',
        text1: 'Login feito com sucesso',
      });
      navigation.navigate('index');
    } catch (err: any) {
      if (err.message === 'Request timed out') {
        Toast.show({
          type: 'error',
          text1: 'Requisição expirou.',
          text2: 'Tente novamente mais tarde.',
        });
      }
      if (
        typeof err == 'object' &&
        err != null &&
        'code' in err &&
        'message' in err &&
        err.code == 'UNAUTHENTICATED'
      ) {
        Toast.show({
          type: 'error',
          text1: 'Erro de autenticação',
          text2:
            (err?.message as string) ||
            'Por favor, verifique suas credenciais.',
        });
        return;
      }
      if (isGraphQLErrorResponse(err)) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao fazer login',
          text2: err.response.errors[0].message,
        });
      }
    }
  });

  return {
    control,
    handleSignin,
    errors,
    theme,
    navigation,
    loading: isPending,
  };
}
