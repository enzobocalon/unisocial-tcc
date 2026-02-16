import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const SearchInputContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.disabled};
  border-radius: 8px;
  padding: 0 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
`;

export const SearchInput = styled.TextInput`
  width: 100%;
  color: #333;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
`;

export const Button = styled.TouchableOpacity``;

export const BottomSheetButton = styled.TouchableOpacity`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
