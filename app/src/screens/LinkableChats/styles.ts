import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const ChatCard = styled.TouchableOpacity`
  padding-right: 16px;
  padding-left: 16px;
  padding-top: 8px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
`;
