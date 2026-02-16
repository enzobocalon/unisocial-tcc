import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const ActionsContainer = styled.View`
  padding: 16px;
  margin-top: 16px;
`;

export const Button = styled.TouchableOpacity`
  flex-direction: row;
  gap: 8px;
  align-items: center;
  margin-top: 24px;
`;

export const BottomSheetButton = styled.TouchableOpacity`
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
