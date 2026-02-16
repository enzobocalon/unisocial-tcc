import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

export const { width } = Dimensions.get('window');

export const Container = styled.View`
  flex: 1;
  justify-content: space-between;
`;

export const Header = styled.View`
  width: 100%;
  height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom-width: 1px;
  border-bottom-color: #cdd0d1;
  overflow: hidden;
`;

export const Publish = styled.TouchableOpacity<{ canPublicate?: boolean }>`
  background-color: ${({ theme }) => theme.colors.blue};
  padding: 6px 12px;
  border-radius: 8px;
  opacity: ${({ canPublicate }) => (!canPublicate ? 0.5 : 1)};
`;

export const Content = styled.View`
  flex-direction: column;
  flex: 1;
  padding: 0 8px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-top: 8px;
  gap: 8px;
  flex: 1;
`;

export const Input = styled.TextInput`
  flex: 1;
  margin-top: -8px;
  color: #333;
`;

export const MediaGridContainer = styled.View`
  margin-bottom: 8px;
`;

export const Footer = styled.View`
  width: 100%;
  height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-top-width: 1px;
  border-top-color: #cdd0d1;
`;

export const DeviceMediaGrid = styled.View`
  flex: 1;
  margin-top: 8px;
  max-height: ${width * 0.25}px;
  margin-bottom: 8px;
`;

export const DeviceMedia = styled.Image`
  border-radius: 8px;
  width: ${width * 0.25 - 8}px;
  height: ${width * 0.25 - 8}px;
`;

export const AddMediaItem = styled.View`
  align-items: center;
  justify-content: center;
  height: ${width * 0.25 - 8}px;
  width: ${width * 0.25 - 8}px;
  border-radius: 8px;
  border: 1px solid #cdd0d1;
  gap: 4px;
`;
