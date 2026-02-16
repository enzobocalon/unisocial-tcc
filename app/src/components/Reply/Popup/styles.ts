import { MotiView } from 'moti';
import styled from 'styled-components/native';
import { isAndroid } from '../../../lib/constants';

export const Container = styled(MotiView)`
  background-color: white;
  padding: 8px;
  box-shadow: 0px 2px 1px rgba(0, 0, 0, ${isAndroid ? 1 : 0.1});
  elevation: 5;
  border-radius: 8px;
  min-width: 125px;
`;

export const Action = styled.TouchableOpacity`
  width: 100%;
  padding: 4px;
  gap: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
