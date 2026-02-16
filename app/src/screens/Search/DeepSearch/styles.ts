import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const SearchInputContainer = styled.View`
  height: 36px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
    background-color: ${({ theme }) => theme.colors.disabled};
  border-radius: 8px;
  padding: 0 8px;
  margin: 0 24px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  color: #333;
  height: 38px;
`;

export const Wrapper = styled.View`
  width: 100%;
`;

export const CenteredContainer = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
