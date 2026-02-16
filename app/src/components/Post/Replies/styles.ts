import { Dimensions as NativeDimensions } from 'react-native';
import styled from 'styled-components/native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { MentionInput } from 'react-native-controlled-mentions';

const Dimensions = NativeDimensions.get('window');

export const Wrapper = styled.View`
  flex: 1;
`;

export const ContainerHeader = styled(BottomSheetView)`
  width: ${Dimensions.width}px;
  padding: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  height: 100%;
  flex: 1;
`;

interface InputContainer {
  borderColor?: string;
}

export const InputContainer = styled.View<InputContainer>`
  flex-direction: row;
  align-items: center;
  padding: 8px;
  width: 100%;
  min-height: 56px;
  gap: 8px;
  border-top-width: 1px;
  border-top-color: ${({ theme, borderColor }) =>
    borderColor ? borderColor : theme.colors.blue};
  background-color: ${({ theme }) => theme.colors.white};
`;

export const Input = styled(MentionInput)`
  width: ${Dimensions.width - 125}px;
`;

export const InputWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.fields};
  border-radius: 8px;
  padding: 0 8px;
`;

export const Send = styled.TouchableOpacity`
  width: 48px;
`;

export const ImageTouch = styled.TouchableOpacity`
  align-items: flex-end;
  justify-content: center;
  margin-left: -24px;
`;

export const ImagesGridContainer = styled.View`
  background-color: white;
  padding: 8px;
  overflow: hidden;
  align-self: flex-start;
  margin-left: 8px;
  margin-bottom: 4px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.lighterGray};
`;

export const EmptyContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: 75%;
  width: 100%;
`;

export const ReplyActionContainer = styled.View`
  padding: 8px;
  background-color: white;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.blue};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ReplyActionTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 4px;
  border-radius: 99px;
`;

export const MediaGridContainer = styled.View`
  margin-bottom: 8px;
`;
