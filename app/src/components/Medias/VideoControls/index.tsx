import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import * as S from './styles';
import { Text } from '../../Text';
import { Pause } from '../../Icons/Pause';
import { Play } from '../../Icons/Play';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onSeekStart?: () => void;
  onSeekChange?: (time: number) => void;
  onFullscreen?: () => void;
}

export const VideoControls = ({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onFullscreen,
}: VideoControlsProps) => {
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSlidingStart = () => {
    setIsSeeking(true);
  };

  const handleValueChange = (value: number) => {
    setSeekTime(value);
  };

  const handleSlidingComplete = (value: number) => {
    setIsSeeking(false);
    onSeek(value);
  };

  const displayTime = isSeeking ? seekTime : currentTime;

  return (
    <S.Container>
      <S.Row>
        <S.PlayButton
          onPress={onPlayPause}
          android_ripple={{
            color: 'rgba(255,255,255,1)',
            borderless: true,
            radius: 24,
          }}
        >
          {isPlaying ? (
            <Pause color="white" size={20} />
          ) : (
            <Play color="white" size={20} />
          )}
        </S.PlayButton>

        <S.SliderContainer>
          <Text color="white">{formatTime(displayTime)}</Text>

          <Slider
            style={{
              flex: 1,
              height: 40,
            }}
            value={displayTime}
            minimumValue={0}
            maximumValue={duration || 1}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
            thumbTintColor="#fff"
            onSlidingStart={handleSlidingStart}
            onValueChange={handleValueChange}
            onSlidingComplete={handleSlidingComplete}
          />

          <Text color="white">{formatTime(duration)}</Text>
        </S.SliderContainer>

        {onFullscreen && (
          <TouchableOpacity onPress={onFullscreen}>
            <Text color="white">⛶</Text>
          </TouchableOpacity>
        )}
      </S.Row>
    </S.Container>
  );
};
