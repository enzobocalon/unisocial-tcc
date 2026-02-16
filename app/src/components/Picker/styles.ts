import { styled } from 'styled-components/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { MotiText, MotiView } from 'moti';

export const Container = styled.View``;

interface PickerProps {
  error?: boolean;
}

export const StyledPicker = styled(DropDownPicker)<PickerProps>`
  width: 100%;
  border-color: ${({ theme, error }) =>
    error ? theme.colors.error.primary : theme.colors.gray};
`;

interface TextProps {
  focus: boolean;
  color?: boolean;
}

export const Text = styled(MotiText)<TextProps>`
  padding: 0 4px;
  margin-top: 1px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme, focus, color }) =>
    color ? color : focus ? theme.colors.gray : '#999'};
  font-weight: bold;
`;

interface AnimatedViewProps {
  loading?: boolean;
}

export const AnimatedView = styled(MotiView)<AnimatedViewProps>`
  position: absolute;
  z-index: 10000;
  ${({ loading }) => (loading ? 'width: 80%;' : '')}
`;
