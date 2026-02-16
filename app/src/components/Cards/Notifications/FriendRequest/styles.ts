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
  flex-direction: row;
  align-items: center;
  flex: 1;
  justify-content: space-between;
`;

export const InfoContainer = styled.View`
  flex: 1;
`;

export const ActionsContainer = styled.View`
  flex-direction: row;
  gap: 24px;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.blue};
  padding: 8px;
  border-radius: 64px;
`;
