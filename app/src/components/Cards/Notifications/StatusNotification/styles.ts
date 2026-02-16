import { styled } from 'styled-components/native';

interface ContainerProps {
  isUnread: boolean;
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  background-color: ${({ theme, isUnread }) =>
    isUnread ? theme.colors.lightBlue : theme.colors.white};
  padding: 8px 16px;
  flex-direction: row;
  gap: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.lighterGray};
`;

export const Wrapper = styled.View`
  flex: 1;
  gap: 8px;
`;
