import { Image, StyleSheet, View } from 'react-native';
import { CustomPressable } from '../../CustomPressable';
import Video from 'react-native-video';
import * as S from './styles';
import { Text } from '../../Text';
import { Cross } from '../../Icons/Cross';
import { useMediaGridItem } from './useMediaGridItem';
import { Media } from '../../../__generated__/graphql';
import { createPath } from '../../../utils/path';
import { Skeleton } from '../../Skeleton';

interface ImageItemProps {
  source: Media;
  listSize: number;
  fullListSize: number;
  index: number;
  onPress: (index: number) => void;
  isVideo?: boolean;
  disablePressable?: boolean;
  size?: number;
  handleSourceChange?: (source: Media) => void;
  onError: () => void;
  useFlex?: boolean;
  width: number | undefined;
  shouldCreatePath?: boolean;
  onLongPress?: () => void;
}

export function MediaGridItem({
  source,
  listSize,
  fullListSize,
  index,
  onPress,
  isVideo,
  disablePressable,
  size,
  handleSourceChange,
  onError,
  width,
  useFlex,
  shouldCreatePath,
  onLongPress,
}: ImageItemProps) {
  const { imagesDimension, handleOnPress, isLoading, setIsLoading } =
    useMediaGridItem({
      size,
      width,
      listSize,
      index,
      onPress,
    });
  const remainingCount = fullListSize - 4;
  const shouldShowRemainingCount = index === 3 && fullListSize > 4;
  return (
    <CustomPressable
      onPress={handleOnPress}
      onLongPress={() => {
        if (onLongPress) onLongPress();
      }}
      android_disableSound
      disabled={disablePressable}
      style={
        !size && {
          flex: useFlex ? 1 : 0,
          position: 'relative',
        }
      }
    >
      {handleSourceChange && (
        <S.DeleteIconContainer onPress={() => handleSourceChange(source)}>
          <Cross size={16} color="white" />
        </S.DeleteIconContainer>
      )}
      <S.Container>
        {isLoading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 10000,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Skeleton />
          </View>
        )}

        {isVideo ? (
          <Video
            source={{ uri: source.url }}
            style={{
              width: imagesDimension?.width,
              height: imagesDimension?.height,
            }}
            onReadyForDisplay={() => setIsLoading(false)}
            resizeMode="cover"
            paused={true}
          />
        ) : (
          <Image
            source={{
              uri: shouldCreatePath ? createPath(source.url) : source.url,
            }}
            style={{
              width: imagesDimension?.width,
              height: imagesDimension?.height,
            }}
            onError={onError}
            onLoadEnd={() => setIsLoading(false)}
          />
        )}

        {shouldShowRemainingCount && (
          <S.Overlay>
            <Text size={24} color="white">
              {remainingCount > 99 ? '99+' : `+${remainingCount}`}
            </Text>
          </S.Overlay>
        )}

        {isVideo && !shouldShowRemainingCount && !isLoading && (
          <S.Overlay>
            <Text size={40} color="white">
              ▶
            </Text>
          </S.Overlay>
        )}
      </S.Container>
    </CustomPressable>
  );
}
