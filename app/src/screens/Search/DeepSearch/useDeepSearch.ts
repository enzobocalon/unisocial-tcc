import { useRef, useState } from 'react';
import { useSearch } from '../useSearch';
import { useTheme } from 'styled-components';
import { CollapsibleRef } from 'react-native-collapsible-tab-view';

export function useDeepSearch(query: string) {
  const { onSearchSubmit } = useSearch(false);
  const [search, setSearch] = useState(query);
  const containerRef = useRef<CollapsibleRef>(null);

  const [index, setIndex] = useState(0);
  const theme = useTheme();

  return {
    search,
    setSearch,
    onSearchSubmit,
    index,
    setIndex,
    theme,
    containerRef,
  };
}
