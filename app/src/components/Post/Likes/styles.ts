import { BottomSheetView } from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

export const UserContainer = styled.TouchableOpacity`
  flex-direction: row;
  gap: 8px;
  align-items: center;
  width: 100%;
  height: 56px;
  margin-bottom: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.lighterGray};
  padding: 0 8px;
`;

export const LoaderContainer = styled(BottomSheetView)`
  height: 350px;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  margin-bottom: 8px;
`;
