import { useCallback, useState } from 'react';
import { Dimensions } from 'react-native';

export function useChatFooter() {
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const screenWidth = Dimensions.get('screen').width;

  const handleScrollEnable = useCallback((contentWidth: number) => {
    setScrollEnabled(contentWidth > screenWidth);
  }, []);

  return {
    scrollEnabled,
    handleScrollEnable,
  };
}
