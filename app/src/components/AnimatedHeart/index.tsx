import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Heart } from '../Icons/Heart';
import { HeartFilled } from '../Icons/HeartFilled';
import { useEffect, useRef } from 'react';

interface AnimatedHeartProps {
  liked: boolean;
  size?: number;
}

export function AnimatedHeart({ liked, size }: AnimatedHeartProps) {
  const animatedLiked = useSharedValue(liked ? 0 : 1);
  const isFirstRender = useRef(true);

  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            animatedLiked.value,
            [0, 1],
            [1, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedLiked.value }],
      opacity: animatedLiked.value,
    };
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    animatedLiked.value = withSpring(liked ? 0 : 1);
  }, [liked]);

  return (
    <>
      <Animated.View
        style={[
          outlineStyle,
          {
            position: 'absolute',
          },
        ]}
      >
        <HeartFilled color="#FF4848" size={size} />
      </Animated.View>

      <Animated.View style={fillStyle}>
        <Heart size={size} />
      </Animated.View>
    </>
  );
}
