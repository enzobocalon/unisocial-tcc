import { TextInput } from 'react-native';
import { DefaultInput, DefaultInputProps } from './DefaultInput';
import * as S from './styles';
import { Error } from '../Error';
import React, { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components';

type Props = React.ComponentProps<typeof TextInput> &
  DefaultInputProps & {
    childrenLocation?: 'left' | 'right';
    error?: string;
    animation?: {
      animationIn?: number;
      animationOut?: number;
    };
  };

export function Input({
  children,
  childrenLocation = 'left',
  error,
  animation,
  ...props
}: Props) {
  const { placeholder, value } = props;
  const [focus, setFocus] = useState(false);
  const innerRef = useRef<TextInput | null>(null);
  const theme = useTheme();
  return (
    <S.InputContainer onPress={() => innerRef.current?.focus()}>
      <S.InputWrapper error={!!error}>
        {children && childrenLocation === 'left' && children}
        <DefaultInput
          {...props}
          ref={innerRef}
          placeholder=""
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        <S.AnimatedView
          animate={{
            left: focus || value ? animation?.animationIn || 12 : 32,
            top: focus || value ? -12 : animation?.animationOut || 12,
          }}
          transition={{ type: 'timing', duration: 100 }}
        >
          <TouchableOpacity
            onPressIn={() => innerRef.current?.focus()}
            onBlur={() => innerRef.current?.blur()}
            activeOpacity={1}
          >
            <S.Text
              color={error ? theme.colors.error.primary : undefined}
              focus={focus || !!value}
            >
              {placeholder}
            </S.Text>
          </TouchableOpacity>
        </S.AnimatedView>
        {children && childrenLocation === 'right' && children}
      </S.InputWrapper>
      {error && <Error>{error}</Error>}
    </S.InputContainer>
  );
}
