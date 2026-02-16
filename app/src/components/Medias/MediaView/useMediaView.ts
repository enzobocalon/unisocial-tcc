import { useEffect, useState } from 'react';
import { Media } from '../../../__generated__/graphql';

export function useMediaView(index: number, media: Media[], visible: boolean) {
  const [currentIndex, setCurrentIndex] = useState(index);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(index);
    }
  }, [visible, index]);

  function handleChangeIndex(idx: number) {
    setCurrentIndex(idx);
  }
  return {
    currentIndex,
    handleChangeIndex,
  };
}
