import styled from 'styled-components/native';

export const Container = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  position: relative;
  margin-left: 8px;
  margin-right: 8px;
`;

export const IconContainer = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 99px;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.View`
  flex: 1;
`;
