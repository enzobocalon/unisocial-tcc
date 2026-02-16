import styled from 'styled-components/native';

export const Container = styled.View`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  position: relative;
`;

export const OnlineIcon = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: rgb(28, 209, 79);
  position: absolute;
  bottom: 2px;
  right: 2px;
  z-index: 1000;
`;
