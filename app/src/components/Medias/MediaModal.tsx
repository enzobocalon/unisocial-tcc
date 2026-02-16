// src/screens/MediaModal.tsx
import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackParams, StackProps } from '../../types/Navigation';
import { MediaView } from './MediaView';

type MediaModalRouteProp = RouteProp<StackParams, 'MediaModal'>;

export function MediaModal() {
  const navigation = useNavigation<StackProps>();
  const route = useRoute<MediaModalRouteProp>();

  const { media, index, shouldCreatePath } = route.params;

  return (
    <MediaView
      visible
      media={media}
      index={index}
      shouldCreatePath={shouldCreatePath}
      onRequestClose={() => navigation.goBack()}
    />
  );
}
