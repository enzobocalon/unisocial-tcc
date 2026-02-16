import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: white;
  flex: 1;
`;

export const Wrapper = styled.View`
  padding: 8px 16px;
  border-bottom-width: 2px;
  border-bottom-color: ${({ theme }) => theme.colors.lighterGray};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ImageContainer = styled.View`
  position: relative;
  width: 56px;
  height: 56px;
`;

export const Overlay = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 56px;
  height: 56px;
  background-color: rgba(0, 0, 0, 0.25);
  padding: 4px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
`;

export const InputContainer = styled.View`
  flex: 1;
  padding: 0 16px;
`;

export const Input = styled.TextInput`
  padding: 4px 0;
  width: 100%;
  border-bottom-width: 2px;
  border-bottom-color: ${({ theme }) => theme.colors.blue};
  font-size: 15px;
`;
