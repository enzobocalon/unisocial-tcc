import styled from 'styled-components/native';
import { isAndroid } from '../../lib/constants';

export const LoadingMoreContainer = styled.View`
  position: absolute;
  padding: 8px;
  bottom: 0;
  left: 0;
  right: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const LoadingMoreWrapper = styled.View`
  background-color: white;
  box-shadow: 0px 2px 1px rgba(0, 0, 0, ${isAndroid ? 1 : 0.1});
  elevation: 5;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 40px;
`;
