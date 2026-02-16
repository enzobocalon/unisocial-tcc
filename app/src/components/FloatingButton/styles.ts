import styled from 'styled-components/native';

interface ContainerProps {
  size?: number;
}

export const Container = styled.View<ContainerProps>`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 999;
  border-radius: 50px;
  width: ${({ size }) => size || 56}px;
  height: ${({ size }) => size || 56}px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.blue};
`;
