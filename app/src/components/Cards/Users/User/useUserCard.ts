import { useTheme } from 'styled-components';

export function useUserCard() {
  const theme = useTheme();

  return {
    theme,
  };
}
