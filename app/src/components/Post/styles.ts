import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 8px 0px;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.lighterGray};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.lighterGray};
`;

interface AuthorContainerProps {
  hasUserAction: boolean;
}

export const AuthorContainer = styled.View<AuthorContainerProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ hasUserAction }) => (hasUserAction ? '8px' : '0')};
  padding: 0 16px;
`;

export const Body = styled.View`
  padding: 12px 16px;
`;

export const PostStats = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
`;

export const PostStatsWrapper = styled.View`
  flex-direction: row;
  gap: 4px;
`;

export const PostStatsItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
