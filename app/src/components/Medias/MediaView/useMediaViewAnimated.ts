import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';
import { useRef, useEffect, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { Gesture } from 'react-native-gesture-handler';

export function useMediaViewAnimated(
  visible: boolean,
  onRequestClose: () => void,
  isVideo: boolean
) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateYImage = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const pagerRef = useRef<PagerView>(null);
  const isZoomed = useSharedValue(false);
  const [isZoomedState, setIsZoomedState] = useState(false);

  useEffect(() => {
    if (visible) {
      translateY.value = 0;
      scale.value = 1;
      savedScale.value = 1;
      translateX.value = 0;
      translateYImage.value = 0;
      isZoomed.value = false;
      setIsZoomedState(false);
    }
  }, [visible]);

  // Swipe vertical para fechar modal
  const panGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .failOffsetX([-10, 10])
    .enabled(!isZoomedState)
    .onUpdate((event) => {
      if (!isZoomed.value) translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (isZoomed.value) return;

      const shouldClose =
        Math.abs(event.translationY) > 100 && Math.abs(event.velocityY) > 300;

      if (shouldClose) {
        runOnJS(onRequestClose)();
        translateY.value = withTiming(event.translationY > 0 ? 1000 : -1000, {
          duration: 150,
        });
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
    });

  // Pinch gesture para zoom
  const pinchGesture = Gesture.Pinch()
    .enabled(!isVideo)
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
      if (scale.value < 1) {
        translateX.value = 0;
        translateYImage.value = 0;
      }
      isZoomed.value = scale.value > 1;
      runOnJS(setIsZoomedState)(scale.value > 1);
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
        translateX.value = 0;
        translateYImage.value = 0;
        savedScale.value = 1;
      } else {
        savedScale.value = scale.value;
      }
    });

  // Pan para mover a imagem quando zoomed
  const panImageGesture = Gesture.Pan()
    .enabled(isZoomedState && !isVideo)
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateYImage.value;
    })
    .onUpdate((event) => {
      if (scale.value > 1) {
        translateX.value = startX.value + event.translationX;
        translateYImage.value = startY.value + event.translationY;
      }
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        translateX.value = withSpring(0);
        translateYImage.value = withSpring(0);
      }
    });

  // Double tap para resetar zoom
  const doubleTapGesture = Gesture.Tap()
    .enabled(!isVideo)
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSpring(1);
      savedScale.value = 1;
      translateX.value = withSpring(0);
      translateYImage.value = withSpring(0);
      isZoomed.value = false;
      runOnJS(setIsZoomedState)(false);
    });

  // Compor todos os gestos juntos
  const composedGesture = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    doubleTapGesture,
    panImageGesture
  );

  // Animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => {
    const backgroundScale = interpolate(
      Math.abs(translateY.value),
      [0, 200],
      [1, 0.9],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY: translateY.value }, { scale: backgroundScale }],
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      Math.abs(translateY.value),
      [0, 300],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { backgroundColor: `rgba(0,0,0,${opacity})` };
  });

  const closeButtonAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      Math.abs(translateY.value),
      [0, 150],
      [1, 0],
      Extrapolate.CLAMP
    );
    const translateYButton = translateY.value * 0.3;
    return { opacity, transform: [{ translateY: translateYButton }] };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateYImage.value },
    ],
  }));

  return {
    backgroundAnimatedStyle,
    contentAnimatedStyle,
    closeButtonAnimatedStyle,
    panGesture,
    pagerRef,
    composedGesture,
    imageAnimatedStyle,
    isZoomed,
    isZoomedState,
    setIsZoomedState,
  };
}
