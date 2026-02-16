import { useCallback } from 'react';
import * as S from './styles';
import { FlatList, ScrollView, View } from 'react-native';
import { MediaGridItem } from '../MediaGridItem';
import Toast from 'react-native-toast-message';
import { Media } from '../../../__generated__/graphql';
import { checkMediaFormat } from '../../../utils/checkMediaFormat';
import { StackProps } from '../../../types/Navigation';
import { useNavigation } from '@react-navigation/native';

interface ImageGridProps {
  sources: Media[];
  disablePressable?: boolean;
  size?: number;
  handleSourceChange?: (source: Media) => void;
  horizontal?: boolean;
  useImageFlex?: boolean;
  width?: number;
  shouldCreatePath?: boolean;
  onItemLongPress?: () => void;
  useScrollView?: boolean; // NOVA PROP
}

export function MediaGrid({
  sources,
  disablePressable,
  handleSourceChange,
  size,
  horizontal,
  useImageFlex,
  width,
  shouldCreatePath = true,
  onItemLongPress,
  useScrollView = false, // PADRÃO false para manter compatibilidade
}: ImageGridProps) {
  const navigation = useNavigation<StackProps>();
  const source = sources.slice(0, 4);

  const onImagePress = useCallback((index: number) => {
    navigation.navigate('MediaModal', {
      media: sources,
      index: index,
      shouldCreatePath: true,
    });
  }, []);

  const handleImageLoadError = (source: Media) => {
    if (handleSourceChange !== undefined) {
      handleSourceChange(source);
    }
    Toast.show({
      type: 'error',
      text1: 'Erro ao carregar imagem',
      text2: 'A imagem não pôde ser carregada, tente novamente mais tarde.',
    });
  };

  const renderItem = (item: Media, index: number) => (
    <MediaGridItem
      width={width}
      source={item}
      listSize={source.length}
      fullListSize={sources.length}
      index={index}
      disablePressable={disablePressable}
      onPress={onImagePress}
      handleSourceChange={handleSourceChange}
      onError={() => handleImageLoadError(item)}
      key={item.url}
      useFlex={useImageFlex}
      size={size}
      shouldCreatePath={shouldCreatePath}
      isVideo={checkMediaFormat(item.url) === 'video'}
      onLongPress={onItemLongPress}
    />
  );

  // Se useScrollView for true, usa ScrollView ao invés de FlatList
  if (useScrollView) {
    return (
      <S.Container>
        <ScrollView
          horizontal={!!horizontal}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{
            gap: 2,
            padding: 8,
            flexDirection: horizontal ? 'row' : 'column',
          }}
        >
          {horizontal ? (
            // Horizontal: renderiza direto
            source.map((item, index) => renderItem(item, index))
          ) : (
            // Vertical: cria grid de 2 colunas manualmente
            <>
              {Array.from({ length: Math.ceil(source.length / 2) }).map(
                (_, rowIndex) => (
                  <View key={rowIndex} style={{ flexDirection: 'row', gap: 2 }}>
                    {source
                      .slice(rowIndex * 2, rowIndex * 2 + 2)
                      .map((item, colIndex) =>
                        renderItem(item, rowIndex * 2 + colIndex)
                      )}
                  </View>
                )
              )}
            </>
          )}
        </ScrollView>
      </S.Container>
    );
  }

  // Comportamento padrão com FlatList
  return (
    <S.Container>
      <FlatList
        data={source}
        keyExtractor={(item) => item.id}
        horizontal={!!horizontal}
        renderItem={({ item, index }) => renderItem(item, index)}
        columnWrapperStyle={horizontal ? undefined : { gap: 2 }}
        contentContainerStyle={{
          gap: 2,
          padding: 8,
        }}
        numColumns={horizontal ? undefined : 2}
      />
    </S.Container>
  );
}
