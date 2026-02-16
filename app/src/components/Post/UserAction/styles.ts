import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.lighterGray};
  padding: 4px 0 8px 16px;
`;

export const AvatarWrapper = styled.View``;

export const TextWrapper = styled.View`
  flex: 1;
  flex-shrink: 1;
`;
