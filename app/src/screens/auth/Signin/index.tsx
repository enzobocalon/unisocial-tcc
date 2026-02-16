import { Button } from '../../../components/Button';
import { Lock } from '../../../components/Icons/Lock';
import { User } from '../../../components/Icons/User';
import { Input } from '../../../components/Input';
import { Text } from '../../../components/Text';
import { TouchableOpacity } from 'react-native';
import { APP_NAME } from '../../../lib/constants';
import * as S from '../styles';
import bgImage from '../../../assets/images/background-guest.jpg';
import { useSignin } from './useSignin';
import { Controller } from 'react-hook-form';

export function Signin() {
  const { control, errors, handleSignin, navigation, theme, loading } =
    useSignin();
  return (
    <S.Container>
      <S.ImageBackground
        source={bgImage}
        imageStyle={{
          resizeMode: 'cover',
          opacity: 0.7,
          width: '150%',
          height: '150%',
        }}
      >
        <Text
          style={{ marginVertical: 32 }}
          color="white"
          weight="Bold"
          size={32}
        >
          {APP_NAME}
        </Text>
        <S.Wrapper>
          <Text size={24} weight="Bold" align="center">
            Entrar
          </Text>
          <Text
            size={18}
            style={{ width: '100%', marginVertical: 12, letterSpacing: -0.8 }}
            align="center"
          >
            Insira seus dados abaixo para começar sua integração universitária.
          </Text>
          <S.DataContainer>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Seu e-mail"
                  fullSize
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                >
                  <User
                    color={
                      errors.email?.message
                        ? theme.colors.error.primary
                        : undefined
                    }
                  />
                </Input>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Sua senha"
                  fullSize
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                  secureTextEntry
                >
                  <Lock
                    color={
                      errors.password?.message
                        ? theme.colors.error.primary
                        : undefined
                    }
                  />
                </Input>
              )}
            />

            <Button onPress={handleSignin} loading={loading}>
              <Text color="white" weight="Bold">
                Entrar
              </Text>
            </Button>
            <TouchableOpacity
              style={{ width: 'auto' }}
              hitSlop={8}
              activeOpacity={0.8}
            >
              <Text
                weight="Semibold"
                align="right"
                style={{ marginTop: 16 }}
                color={theme.colors.blue}
              >
                Esqueci minha senha.
              </Text>
            </TouchableOpacity>

            <S.ActionContainer>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={8}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text align="center">
                  Não tem uma conta?{' '}
                  <Text weight="Semibold" color={theme.colors.blue}>
                    Cadastre-se
                  </Text>
                </Text>
              </TouchableOpacity>
            </S.ActionContainer>
          </S.DataContainer>
        </S.Wrapper>
      </S.ImageBackground>
    </S.Container>
  );
}
