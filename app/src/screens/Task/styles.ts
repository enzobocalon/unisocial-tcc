import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const TopBar = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

export const Header = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.View`
  width: 64px;
  height: 64px;
  align-items: center;
  justify-content: center;
  background-color: #d3d3d3;
  border-radius: 99px;
`;

export const TextContainer = styled.View`
  margin-top: 16px;
  width: 100%;
  align-items: center;
  max-width: ${Dimensions.get('window').width - 32}px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const QuickActions = styled.View`
  flex-direction: row;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

export const QuickAction = styled.TouchableOpacity`
  padding: 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.blue};
  border-radius: 8px;
  align-items: center;
  gap: 8px;
  min-width: 96px;
`;

export const FilesContainer = styled.View`
  width: 100%;
  padding: 16px;
`;

export const FilesWrapper = styled.View`
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 12px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const Button = styled.TouchableOpacity`
  padding: 16px;
`;

export const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  width: 100%;
`;

export const BottomSheetButton = styled.TouchableOpacity`
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
