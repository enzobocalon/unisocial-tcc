import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 4px 8px;
  width: ${Dimensions.get('window').width}px;
`;

export const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const InfoContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  gap: 8px;
`;

export const IconContainer = styled.View`
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  max-height: 32px;
  max-width: 32px;
`;

export const InfoContainerText = styled.View`
  flex: 1;
`;
