import { styled } from 'styled-components/native';
import { isAndroid } from '../../lib/constants';

export const Container = styled.SafeAreaView`
  background-color: ${({ theme }) => theme.colors.blue};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ImageBackground = styled.ImageBackground`
  flex: 1;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

export const Wrapper = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  flex: 1;
  border-radius: 48px 48px 0px 0px;
  width: 100%;
  padding: 24px 32px 0 32px;
  box-shadow: 0px 2px 1px rgba(0, 0, 0, ${isAndroid ? 1 : 0.1});
  elevation: 5;
`;

export const DataContainer = styled.View`
  flex: 1;
  margin: 12px 0;
`;

export const ActionContainer = styled.View`
  justify-content: flex-end;
  align-items: center;
  flex: 1;
`;
