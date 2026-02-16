import { useImperativeHandle, useRef } from 'react';
import { CollapsibleRef } from 'react-native-collapsible-tab-view';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components';

export function useTabBar(
  ref: React.ForwardedRef<CollapsibleRef>,
  initialName?: string
) {
  const focusedItem = useSharedValue(initialName || '');
  const containerRef = useRef<CollapsibleRef>(null);
  const theme = useTheme();
  const getItemStyle = (name: string) => {
    return useAnimatedStyle(() => {
      const isFocused = focusedItem.value === name;
      return {
        transform: [
          {
            scale: withSpring(isFocused ? 1.05 : 1),
          },
        ],
        opacity: withSpring(isFocused ? 1 : 0.8),
      };
    });
  };

  useImperativeHandle(ref, () => ({
    jumpToTab: (name: string) => {
      if (containerRef.current?.jumpToTab) {
        return containerRef.current.jumpToTab(name);
      }
      return false;
    },
    setIndex: (index: number) => {
      if (containerRef.current?.setIndex) {
        return containerRef.current.setIndex(index);
      }
      return false;
    },
    getFocusedTab: () => {
      if (containerRef.current?.getFocusedTab) {
        return containerRef.current.getFocusedTab();
      }
      return '';
    },
    getCurrentIndex: () => {
      if (containerRef.current?.getCurrentIndex) {
        return containerRef.current.getCurrentIndex();
      }
      return 0;
    },
  }));

  return {
    theme,
    focusedItem,
    getItemStyle,
    containerRef,
  };
}
