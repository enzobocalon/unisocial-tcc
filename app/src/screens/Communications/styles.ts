import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  background-color: white;
  max-height: ${Dimensions.get('window').height}px;
  position: 'relative';
  flex: 1;
`;

export const MinView = styled.View`
  min-height: 2px;
`;
