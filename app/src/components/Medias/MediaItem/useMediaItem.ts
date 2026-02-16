import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image } from 'react-native';
import { OnLoadData, OnProgressData, VideoRef } from 'react-native-video';

export function useMediaItem(source: string, isVideo: boolean | undefined) {
  const [windowSize, setWindowSize] = useState(Dimensions.get('window'));
  const [isLoading, setIsLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({
    width: windowSize.width,
    height: windowSize.height,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const videoRef = useRef<VideoRef | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({ window }) => {
      setWindowSize(window);
    });
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isVideo) {
      Image.getSize(
        source,
        (w, h) => {
          if (mountedRef.current && w && h) {
            setImageDimensions({ width: w, height: h });
          }
        },
        (error) => {
          console.error('Failed to get image size:', error);
          if (mountedRef.current) {
            // Usa dimensões padrão em caso de erro
            setImageDimensions({
              width: windowSize.width,
              height: windowSize.height,
            });
          }
        }
      );
    }
  }, [source, isVideo]);

  const handlePlayPause = () => {
    setIsPaused(!isPaused);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    videoRef.current?.seek(time);
  };

  const handleSeekComplete = () => {
    setIsSeeking(false);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (time: number) => {
    setCurrentTime(time);
  };

  const handleProgress = (data: OnProgressData) => {
    if (!data || isSeeking || !mountedRef.current) return;
    setCurrentTime(data.currentTime || 0);
  };

  const handleLoad = (data: OnLoadData) => {
    if (!data || !mountedRef.current) return;
    setDuration(data.duration || 0);
  };

  return {
    imageDimensions,
    windowSize,
    setIsLoading,
    isLoading,
    handleLoad,
    handlePlayPause,
    handleProgress,
    handleSeek,
    handleSeekChange,
    handleSeekComplete,
    handleSeekStart,
    isPaused,
    currentTime,
    duration,
    videoRef,
  };
}
