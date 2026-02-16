import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  elevation: 2;
  max-height: 52px;
`;

export const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const CenterContainer = styled.View<{ isCentered: boolean }>`
  flex: 1;
  align-items: ${({ isCentered }) => (isCentered ? 'center' : 'flex-start')};
  padding-left: ${({ isCentered }) => (isCentered ? '0px' : '16px')};
`;
