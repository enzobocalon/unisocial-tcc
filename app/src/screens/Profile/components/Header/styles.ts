import styled from 'styled-components/native';

export const Container = styled.View`
  position: relative;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  position: relative;
  margin-top: 8px;
  padding: 0 16px;
`;

export const AvatarContainer = styled.View`
  position: absolute;
  left: 16px;
  top: -40px;
  z-index: 10001;
`;

export const Wrapper = styled.View`
  padding: 0 16px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  gap: 8px;
`;

export const Button = styled.TouchableOpacity`
  background-color: white;
  border-radius: 16px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.blue};
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const BackContainer = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 32px;
  height: 32px;
  z-index: 10000;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.4);
`;
