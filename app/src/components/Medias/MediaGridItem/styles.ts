import styled from 'styled-components/native';

export const Container = styled.View`
  position: relative;
  overflow: hidden;
`;

export const Overlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const DeleteIconContainer = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50px;
  padding: 4px;
`;
