import { MotiPressable } from 'moti/interactions';
import styled from 'styled-components/native';
import { isAndroid } from '../../lib/constants';

export const StyledPressable = styled(MotiPressable)`
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.disabled : theme.colors.blue};
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 2px 1px rgba(0, 0, 0, ${isAndroid ? 1 : 0.1});
  elevation: 3;
` as typeof MotiPressable;
