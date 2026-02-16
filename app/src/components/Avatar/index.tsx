import * as S from './styles';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  ImageStyle,
  Image,
} from 'react-native';
import avatarPlaceholder from '../../assets/images/avatar-placeholder.png';
import groupPlaceholder from '../../assets/images/team-placeholder.png';
import { createPath } from '../../utils/path';
import { useEffect, useMemo, useState, memo } from 'react';
import { Skeleton } from '../Skeleton';

interface AvatarProps {
  source?: string | null;
  size?: number;
  color?: string;
  shouldCreatePath?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ImageStyle>;
  online?: boolean;
  useGroupPlaceholder?: boolean;
  borderRadius?: number;
}

const Avatar = memo(
  function AvatarInternal({
    source,
    size = 24,
    shouldCreatePath = true,
    containerStyle,
    style,
    online,
    useGroupPlaceholder = false,
    borderRadius,
  }: AvatarProps) {
    const [isLoading, setIsLoading] = useState(true);

    const imageSource = useMemo(() => {
      if (source) {
        return { uri: shouldCreatePath ? createPath(source) : source };
      }
      return useGroupPlaceholder ? groupPlaceholder : avatarPlaceholder;
    }, [source, shouldCreatePath, useGroupPlaceholder]);

    useEffect(() => {
      setIsLoading(true);
    }, [imageSource]);

    return (
      <S.Container
        style={[
          {
            width: size,
            height: size,
            borderRadius: borderRadius ?? size / 2,
            overflow: 'hidden',
          },
          containerStyle,
        ]}
      >
        {isLoading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <Skeleton borderRadius={borderRadius ?? size / 2} />
          </View>
        )}

        <Image
          source={imageSource}
          style={[
            {
              width: '100%',
              height: '100%',
              borderRadius: borderRadius ?? size / 2,
              position: 'absolute',
              zIndex: 2,
            },
            style,
          ]}
          onLoad={() => setIsLoading(false)}
        />

        {online && <S.OnlineIcon />}
      </S.Container>
    );
  },
  (prev, next) => prev.source === next.source
);

Avatar.displayName = 'Avatar';
export { Avatar };
