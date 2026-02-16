import { useState } from 'react';
import { useTheme } from 'styled-components';
import { storage } from '../../../../lib/storage';

export function useTrackingConfig() {
  const [enableConfig, setEnableConfig] = useState<boolean>(() => {
    const storedValue = storage.getBoolean(
      '@tracking_config:shouldEnableTracking'
    );
    return storedValue !== null && storedValue !== undefined
      ? storedValue
      : true;
  });
  const theme = useTheme();

  const toggleEnableConfig = () => {
    setEnableConfig((prev) => {
      storage.set('@tracking_config:shouldEnableTracking', !prev);
      return !prev;
    });
  };

  return {
    enableConfig,
    toggleEnableConfig,
    theme,
  };
}
