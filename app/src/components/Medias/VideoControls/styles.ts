import styled from 'styled-components/native';

export const Container = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 16px 12px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const PlayButton = styled.Pressable`
  padding: 8px;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  min-height: 40px;
  border-radius: 9999px;
  overflow: hidden;
`;

export const SliderContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
