import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  padding: 8px;
`;

export const Content = styled.View`
  margin-top: 16px;
  gap: 8px;
`;

export const Item = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  border-bottom-width: 1px;
  border-bottom-color: rgb(207, 217, 222);
  padding: 8px 0;
`;

export const ItemTextWrapper = styled.View`
  flex: 1;
`;
