import styled from 'styled-components/native';
import { isAndroid } from '../../lib/constants';

export const Container = styled.View`
  align-items: center;
  width: 64px;
  height: 72px;
`;

interface WrapperProps {
  highlight?: boolean;
}

export const Wrapper = styled.View<WrapperProps>`
  width: 56px;
  height: 56px;
  border-radius: 28px 28px 28px 0;
  background-color: ${({ theme, highlight }) =>
    highlight ? theme.colors.blue : 'white'};
  box-shadow: 0px 2px 1px rgba(0, 0, 0, ${isAndroid ? 1 : 0.1});
  elevation: 3;
  align-items: center;
  justify-content: center;
  transform: rotate(-45deg);
`;
