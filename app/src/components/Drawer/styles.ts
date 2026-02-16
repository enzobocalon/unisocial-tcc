import { styled } from 'styled-components/native';

export const Container = styled.View`
  padding: 16px;
  flex: 1;
`;

export const Wrapper = styled.View`
  flex: 1;
`;

export const Info = styled.View`
  margin: 16px 0;
`;

export const Separator = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.lighterGray};
`;

export const Item = styled.TouchableOpacity`
  flex-direction: row;
  gap: 16px;
  align-items: center;
  padding: 12px 0;
`;
