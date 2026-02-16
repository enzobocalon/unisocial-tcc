import styled from 'styled-components/native';

interface ContainerProps {
  isHorizontal?: boolean;
}

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Wrapper = styled.View<ContainerProps>`
  max-width: 128px;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  flex-direction: ${({ isHorizontal }) => (isHorizontal ? 'row' : 'column')};
  gap: ${({ isHorizontal }) => (isHorizontal ? '8px' : '0')};
`;
