import { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

export const Overlay = styled(BottomSheetBackdrop)`
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: flex-end;
  align-items: center;
`;

export const Container = styled(BottomSheetView)`
  width: 100%;
  padding: 16px 0;
  background-color: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  z-index: 1;
  gap: 8px;
  z-index: 999;
`;

export const LoaderContainer = styled(BottomSheetView)`
  height: 350px;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
`;
