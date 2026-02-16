import { StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated from 'react-native-reanimated';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import * as S from './styles';
import { MediaItem } from '../MediaItem';
import { Cross } from '../../Icons/Cross';
import { useMediaView } from './useMediaView';
import { useMediaViewAnimated } from './useMediaViewAnimated';
import { Media } from '../../../__generated__/graphql';
import { createPath } from '../../../utils/path';
import { checkMediaFormat } from '../../../utils/checkMediaFormat';

interface Props {
  visible: boolean;
  media: Media[];
  onRequestClose: () => void;
  index: number;
  shouldCreatePath?: boolean;
}

export function MediaView({
  visible,
  media,
  index,
  onRequestClose,
  shouldCreatePath,
}: Props) {
  const { currentIndex, handleChangeIndex } = useMediaView(
    index,
    media,
    visible
  );

  const currentItem = media[currentIndex];
  const isVideo = currentItem && checkMediaFormat(currentItem.url) === 'video';

  const {
    backgroundAnimatedStyle,
    contentAnimatedStyle,
    closeButtonAnimatedStyle,
    pagerRef,
    composedGesture,
    imageAnimatedStyle,
  } = useMediaViewAnimated(visible, onRequestClose, isVideo);

  if (!visible) return;

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          position: 'absolute',
          zIndex: 9999,
          elevation: 9999,
          backgroundColor: 'black',
        },
      ]}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          style={[StyleSheet.absoluteFill, backgroundAnimatedStyle]}
        />

        <S.CloseContainer style={closeButtonAnimatedStyle}>
          <View style={{ borderRadius: 24, overflow: 'hidden' }}>
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple(
                'rgba(255,255,255,0.3)',
                true,
                24
              )}
              onPressOut={onRequestClose}
              delayPressOut={200}
            >
              <View
                style={{
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cross color="white" />
              </View>
            </TouchableNativeFeedback>
          </View>
        </S.CloseContainer>

        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[StyleSheet.absoluteFill, contentAnimatedStyle]}
          >
            <PagerView
              ref={pagerRef}
              style={StyleSheet.absoluteFill}
              initialPage={index}
              onPageSelected={(e) => handleChangeIndex(e.nativeEvent.position)}
              orientation="horizontal"
            >
              {media.map((item, itemIndex) => {
                const isVideo = checkMediaFormat(item.url) === 'video';
                const isActive = itemIndex === currentIndex;

                return (
                  <MediaItem
                    key={itemIndex}
                    source={
                      shouldCreatePath
                        ? (createPath(item.url) as string)
                        : item.url
                    }
                    isVideo={isVideo}
                    isActive={isActive}
                    animatedStyle={imageAnimatedStyle}
                  />
                );
              })}
            </PagerView>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
}
