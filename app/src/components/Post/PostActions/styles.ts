import styled from 'styled-components/native';

export const ActionsContainer = styled.View`
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.lighterGray};
  margin-top: 8px;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 16px;
`;

export const ActionItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 4px 0;
  flex: 1;
`;
