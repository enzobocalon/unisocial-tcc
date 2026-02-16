import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  max-height: 128px;
  padding: 8px;
`;

export const ImageContainer = styled.View`
  position: relative;
  margin-right: 8px;
`;

export const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  top: 4px;
  left: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 6px;
  border-radius: 9999px;
`;
