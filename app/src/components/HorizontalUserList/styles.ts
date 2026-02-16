import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.lighterGray};
`;

export const Item = styled.TouchableOpacity`
  margin-right: 16px;
  align-items: center;
`;
