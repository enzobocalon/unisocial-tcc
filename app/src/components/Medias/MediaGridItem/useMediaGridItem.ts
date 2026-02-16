import { useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';

type Params = {
  size?: number;
  width: number | undefined;
  index: number;
  listSize: number;
  onPress: (index: number) => void;
};

export function useMediaGridItem({
  size,
  index,
  width,
  listSize,
  onPress,
}: Params) {
  const [isLoading, setIsLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('screen').width - 32
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get('screen').height
  );

  useEffect(() => {
    const onChange = ({
      window,
    }: {
      window: { width: number; height: number };
    }) => {
      setScreenWidth(window.width - 32);
      setScreenHeight(window.height);
    };

    const emitter = Dimensions.addEventListener('change', onChange);

    return () => {
      emitter.remove();
    };
  }, []);

  const { calculatedWidth, calculatedHeight } = useMemo(() => {
    const getAspectRatio = () => screenWidth / screenHeight;

    const calculateHeight = (aspectRatio: number) => {
      const screenWidth = Dimensions.get('screen').width;
      const screenHeight = Dimensions.get('screen').height;

      const calculatedHeight = screenWidth / aspectRatio;

      const isLandscape = screenWidth > screenHeight;

      const heightAdjustment = isLandscape ? 100 : 0;

      if (width) {
        return (
          Math.max(Math.min(calculatedHeight, 300), 150) + heightAdjustment
        );
      }

      if (listSize === 4) {
        return (
          Math.max(Math.min(calculatedHeight, 400), 150) + heightAdjustment
        );
      }

      return Math.max(Math.min(calculatedHeight, 500), 150) + heightAdjustment;
    };

    const getWidth = (customWidth: number, halfWidth = false) => {
      return customWidth > 0
        ? halfWidth
          ? customWidth / 2
          : customWidth
        : (screenWidth - 2) / 2;
    };

    const aspectRatio = getAspectRatio();
    const customWidth = width || screenWidth;

    let calculatedWidth = customWidth;
    let calculatedHeight = size && size > 0 ? size : 250 / 2;

    if (listSize === 1) {
      calculatedWidth = customWidth;
      calculatedHeight = calculateHeight(aspectRatio);
    } else if (listSize >= 2 && listSize <= 4) {
      calculatedWidth = getWidth(customWidth, listSize !== 3 || index !== 2);
      calculatedHeight = calculateHeight(aspectRatio) / 2;
    }

    return { calculatedWidth, calculatedHeight };
  }, [width, size, listSize, index, screenWidth, screenHeight]);

  const handleOnPress = () => {
    onPress(index);
  };

  return {
    imagesDimension: {
      width: calculatedWidth,
      height: calculatedHeight,
    },
    handleOnPress,
    isLoading,
    setIsLoading,
  };
}
