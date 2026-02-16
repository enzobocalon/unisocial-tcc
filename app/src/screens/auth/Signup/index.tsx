import { Button } from '../../../components/Button';
import { Lock } from '../../../components/Icons/Lock';
import { User } from '../../../components/Icons/User';
import { Input } from '../../../components/Input';
import { Text } from '../../../components/Text';
import { TouchableOpacity } from 'react-native';
import { APP_NAME } from '../../../lib/constants';
import * as S from '../styles';
import * as SC from './styles';

import { Picker } from '../../../components/Picker/Picker';
import { Envelope } from '../../../components/Icons/Envelope';
import { Zero } from '../../../components/Icons/Zero';
import bgImage from '../../../assets/images/background-guest.jpg';
import { useSignup } from './useSignup';
import { Controller } from 'react-hook-form';
import { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Terms } from './components/terms';

export function Signup() {
  const {
    control,
    items,
    open,
    setOpen,
    theme,
    navigation,
    errors,
    handleSignup,
    pickerLoading,
    loading,
    handleOnChangePicker,
  } = useSignup();

  const termsRef = useRef<BottomSheetModal>(null);

  // Os termos serão apresentados somente quando o usuário clicar em "Registrar"

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
            Registrar-se
          </Text>
          <Text
            size={18}
            style={{ width: '100%', marginVertical: 12, letterSpacing: -0.8 }}
            align="center"
          >
            Insira seus dados abaixo para participar.
          </Text>
          <S.DataContainer>
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Seu nome"
                  fullSize
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                >
                  <User
                    color={
                      errors.name?.message
                        ? theme.colors.error.primary
                        : undefined
                    }
                  />
                </Input>
              )}
            />

            <Controller
              name="username"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Seu username"
                  fullSize
                  value={value}
                  onChangeText={onChange}
                  error={errors.username?.message}
                >
                  <User
                    color={
                      errors.username?.message
                        ? theme.colors.error.primary
                        : undefined
                    }
                  />
                </Input>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Seu e-mail institucional"
                  fullSize
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                >
                  <Envelope
                    color={
                      errors.email?.message
                        ? theme.colors.error.primary
                        : undefined
                    }
                  />
                </Input>
              )}
            />

            <SC.HorizontalContainer>
              <Controller
                name="RA"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="Seu RA"
                    style={{ minWidth: 64, maxWidth: 80, height: 40 }}
                    keyboardType="number-pad"
                    animation={{
                      animationOut: 14,
                    }}
                    value={value?.toString()}
                    onChangeText={onChange}
                    error={errors.RA?.message}
                  >
                    <Zero
                      color={
                        errors.RA?.message
                          ? theme.colors.error.primary
                          : undefined
                      }
                    />
                  </Input>
                )}
              />

              <Controller
                name="courseId"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Picker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={(state) => {
                      if (pickerLoading) return;
                      if (items && items.length > 0) {
                        setOpen(state);
                      }
                    }}
                    setValue={(data) =>
                      handleOnChangePicker(data(null), onChange)
                    }
                    containerStyle={{ flex: 1 }}
                    placeholder="Seu curso"
                    dropDownDirection="BOTTOM"
                    zIndex={999}
                    error={errors.courseId?.message}
                    loading={pickerLoading}
                  />
                )}
              />
            </SC.HorizontalContainer>

            <Controller
              name="password"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Sua senha"
                  fullSize
                  value={value}
                  onChangeText={onChange}
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

            <Button
              onPress={() => termsRef.current?.present()}
              loading={loading}
            >
              <Text color="white" weight="Bold">
                Registrar
              </Text>
            </Button>

            <S.ActionContainer>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={8}
                onPress={() => navigation.navigate('Signin')}
              >
                <Text align="center">
                  Já tem uma conta?{' '}
                  <Text weight="Semibold" color={theme.colors.blue}>
                    Entre agora.
                  </Text>
                </Text>
              </TouchableOpacity>
            </S.ActionContainer>
          </S.DataContainer>
        </S.Wrapper>
      </S.ImageBackground>
      <Terms
        ref={termsRef}
        onAccept={() => {
          termsRef.current?.dismiss();
          // Só cria cadastro se o usuário aceitar os termos
          handleSignup();
        }}
        onClose={() => termsRef.current?.dismiss()}
      />
    </S.Container>
  );
}
