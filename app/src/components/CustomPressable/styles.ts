import styled from 'styled-components/native';
import { isAndroid } from '../../lib/constants';

export const Pressable = styled.Pressable``;

export const handlePressOnIos = (pressed: boolean) => {
  if (isAndroid) return;

  return {
    opacity: pressed ? 0.5 : 1,
    backgroundColor: pressed ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
  };
};
