import { Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const Container = styled(Animated.View)`
  flex: 1;
  align-items: flex-end;
  background-color: black;
`;

export const Header = styled.TouchableOpacity`
  flex-direction: row;
  max-width: ${Dimensions.get('window').width}px;
  padding: 16px;
`;

export const CloseContainer = styled(Animated.View)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10000;
`;
