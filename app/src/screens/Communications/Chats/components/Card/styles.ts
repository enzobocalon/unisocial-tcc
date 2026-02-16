import styled from 'styled-components/native';

export const Container = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 10px 8px;
  position: relative;
  margin-left: 8px;
  margin-right: 8px;
`;

export const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ContentContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const UnreadContainer = styled.View`
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.blue};
`;

export const OnlineIcon = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: rgb(28, 209, 79);
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 1000;
`;

export const ReadIconContainer = styled.View``;
