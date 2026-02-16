import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { InteractionManager } from 'react-native';

export function useScreenTransition() {
  const [transitionFinished, setTransitionFinished] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setTransitionFinished(true);
      });
      return () => task.cancel();
    }, [])
  );

  return {
    transitionFinished,
  };
}
