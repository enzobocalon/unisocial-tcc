import { TextInput } from 'react-native';
import styled from 'styled-components/native';

export type DefaultInputProps = {
  border?: string | boolean;
  fullSize?: boolean;
};

const StyledInput = styled.TextInput<DefaultInputProps>`
  font-family: GeneralSans-400;
  color: #333;
  width: ${({ fullSize }) => (fullSize ? '100%' : 'auto')};
  border: ${({ border, theme }) =>
    border === true
      ? `1px solid ${theme.colors.gray}`
      : typeof border === 'string'
        ? border
        : 'none'};
  border-radius: 8px;
  padding: 4px 8px;
`;

export const DefaultInput: typeof TextInput = styled(StyledInput).attrs(() => ({
  selectionColor: '#333',
}))``;
