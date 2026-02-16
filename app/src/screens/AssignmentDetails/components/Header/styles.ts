import styled from 'styled-components/native';

export const Container = styled.View``;

export const Wrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

export const TitleContainer = styled.View`
  position: relative;
  margin-top: 12px;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

export const QuickActions = styled.View`
  flex-direction: row;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const QuickAction = styled.TouchableOpacity`
  padding: 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.blue};
  border-radius: 8px;
  align-items: center;
  gap: 8px;
  min-width: 96px;
`;

export const EditContainer = styled.TouchableOpacity``;
