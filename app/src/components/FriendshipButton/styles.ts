import styled from 'styled-components/native';

interface ButtonProps {
  isFriend: boolean;
}

export const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({ theme, isFriend }) =>
    !isFriend ? theme.colors.blue : 'white'};
  border-radius: 16px;
  padding: 8px 16px;
  border: 1px solid
    ${({ theme, isFriend }) => (!isFriend ? 'white' : theme.colors.blue)};
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const Wrapper = styled.View`
  min-width: 64px;
  align-items: center;
  justify-content: center;
`;
