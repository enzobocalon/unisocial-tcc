import styled from 'styled-components/native';
import { Text } from '../Text';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`;

export const Error = styled(Text)`
  color: ${({ theme }) => theme.colors.error.primary};
  letter-spacing: -0.8px;
`;
