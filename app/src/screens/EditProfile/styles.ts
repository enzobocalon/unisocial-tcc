import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  position: relative;
  margin-top: 8px;
  padding: 0 16px;
`;

export const AvatarContainer = styled.TouchableOpacity`
  position: absolute;
  left: 16px;
  top: -40px;
  overflow: hidden;
  border-radius: 32px;
`;

export const BannerContainer = styled.TouchableOpacity``;

export const CenteredPositionedAbsolute = styled.View`
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
`;

export const Form = styled.View`
  margin-top: 48px;
  padding: 0 16px;
  gap: 8px;
`;

export const FormItem = styled.View``;

export const CenteredContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
