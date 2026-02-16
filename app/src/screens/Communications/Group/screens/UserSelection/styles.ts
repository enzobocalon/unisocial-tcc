import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const Wrapper = styled(Animated.View)`
  width: 100%;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

export const IconBorder = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.blue};
  align-items: center;
  justify-content: center;
`;

export const SearchInputContainer = styled.View`
  width: 100%;
  height: 38px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  margin: 0 8px;
  background-color: ${({ theme }) => theme.colors.disabled};
  border-radius: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
`;

export const SearchInput = styled.TextInput`
  width: 100%;
  color: #333;
`;

export const HeaderContainer = styled.View`
  padding: 12px 16px;
`;
