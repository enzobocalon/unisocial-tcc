import { Dimensions } from 'react-native';
import { styled } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const MinView = styled.View`
  min-height: 2px;
  width: 100%;
  max-width: ${Dimensions.get('window').width}px;
`;

export const CenteredContainer = styled.View`
  height: 100%;
  align-items: center;
  justify-content: center;
`;
