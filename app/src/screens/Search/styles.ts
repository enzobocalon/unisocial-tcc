import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const SearchInputContainer = styled.View`
  flex: 1;
  width: 95%;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.disabled};
  border-radius: 8px;
  padding: 20px 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
`;

export const SearchInput = styled.TextInput`
  width: 100%;
  color: #333;
  height: 48px;
`;

export const RecentContainer = styled.View`
  flex: 1;
  background-color: white;
  margin-top: 1px;
`;

export const RecentActions = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const CrossButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export const RecentCard = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
