import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  gap: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 16px;
  padding-left: 16px;
  align-items: center;
  margin-top: 4px;
  justify-content: space-between;
`;

export const ItemContainer = styled.View`
  flex-direction: row;
  gap: 16px;
  align-items: center;
`;

export const AdminContainer = styled.View`
  background-color: #aac7e2ff;
  border-radius: 4px;
  padding: 4px 8px;
`;
