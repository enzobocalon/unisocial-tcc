import { Image, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import Video from 'react-native-video';
import { useMediaItem } from './useMediaItem';
import { Loading } from '../../Loading';
import { VideoControls } from '../VideoControls';
import * as S from './styles';

interface MediaItemProps {
  source: string;
  isVideo?: boolean;
  isActive?: boolean;
  animatedStyle: any;
}

export const MediaItem = ({
  source,
  isVideo,
  isActive = true,
  animatedStyle,
}: MediaItemProps) => {
  const {
    imageDimensions,
    windowSize,
    setIsLoading,
    isLoading,
    currentTime,
    duration,
    handleLoad,
    handlePlayPause,
    handleProgress,
    handleSeek,
    handleSeekChange,
    handleSeekStart,
    isPaused,
    videoRef,
  } = useMediaItem(source, isVideo);

  const imageAspectRatio = imageDimensions.width / imageDimensions.height;
  const screenAspectRatio = windowSize.width / windowSize.height;

  let width = windowSize.width;
  let height = windowSize.height;

  if (!isVideo) {
    if (imageAspectRatio > screenAspectRatio) {
      width = windowSize.width;
      height = windowSize.width / imageAspectRatio;
    } else {
      height = windowSize.height;
      width = windowSize.height * imageAspectRatio;
    }
  }

  return (
    <S.Container
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      {isLoading && (
        <S.LoadingContainer style={StyleSheet.absoluteFill}>
          <Loading />
        </S.LoadingContainer>
      )}

      <Animated.View
        style={[
          animatedStyle,
          {
            width: width || windowSize.width,
            height: height || windowSize.height,
          },
        ]}
      >
        {!isVideo ? (
          <Image
            source={{ uri: source }}
            style={{
              width: width || windowSize.width,
              height: height || windowSize.height,
            }}
            resizeMode="contain"
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
        ) : (
          <S.VideoContainer style={{ width, height }}>
            <Video
              ref={videoRef}
              source={{ uri: source }}
              style={{ width, height }}
              resizeMode="contain"
              repeat={false}
              paused={!isActive || isPaused}
              onReadyForDisplay={() => setIsLoading(false)}
              onProgress={handleProgress}
              onLoad={handleLoad}
              progressUpdateInterval={250}
            />
            {!isLoading && (
              <VideoControls
                isPlaying={!isPaused && isActive}
                currentTime={currentTime}
                duration={duration}
                onPlayPause={handlePlayPause}
                onSeek={handleSeek}
                onSeekStart={handleSeekStart}
                onSeekChange={handleSeekChange}
              />
            )}
          </S.VideoContainer>
        )}
      </Animated.View>
    </S.Container>
  );
};
