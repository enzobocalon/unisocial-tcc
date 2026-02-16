import { MotiText, MotiView } from 'moti';
import styled from 'styled-components/native';

export const InputContainer = styled.Pressable`
  margin: 0 0 16px 0;
`;

interface InputWrapperProps {
  error?: boolean;
}

export const InputWrapper = styled.View<InputWrapperProps>`
  border: 1px solid
    ${({ theme, error }) =>
      error ? theme.colors.error.primary : theme.colors.gray};
  border-radius: 8px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  position: relative;
`;

export const AnimatedView = styled(MotiView)`
  position: absolute;
`;

interface TextProps {
  focus: boolean;
  color?: string;
}

export const Text = styled(MotiText)<TextProps>`
  padding: 0 4px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme, focus, color }) =>
    color ? color : focus ? theme.colors.gray : '#999'};
  font-weight: bold;
`;
