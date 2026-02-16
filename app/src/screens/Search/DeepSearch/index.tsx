import { StackScreenProps } from '@react-navigation/stack';
import { StackParams } from '../../../types/Navigation';
import * as S from './styles';
import { useDeepSearch } from './useDeepSearch';
import ScreenHeader from '../../../components/ScreenHeader';
import { Search as SearchIcon } from '../../../components/Icons/Search';
import { Tabs } from 'react-native-collapsible-tab-view';
import { UsersScene } from './Scenes/UsersScene';
import { TabBar } from '../../../components/TabBar';
import { MainScene } from './Scenes/MainScene';
import { memo } from 'react';
import { View } from 'react-native';

const MainSceneMemo = memo(MainScene);

type DeepSearchProps = StackScreenProps<StackParams, 'DeepSearch'>;

export function DeepSearch({ route }: DeepSearchProps) {
  const { query } = route.params;

  const { search, setSearch, onSearchSubmit, containerRef } =
    useDeepSearch(query);
  return (
    <S.Container>
      <ScreenHeader
        renderBackButton
        renderRightComponent={() => <View></View>}
        renderMidComponent={() => (
          <S.SearchInputContainer>
            <SearchIcon />
            <S.SearchInput
              placeholder="Buscar"
              value={search}
              onChangeText={(e) => setSearch(e)}
              enterKeyHint="search"
              onSubmitEditing={() => {
                onSearchSubmit(search);
              }}
              textAlignVertical="center"
            />
          </S.SearchInputContainer>
        )}
      />

      <TabBar initialTabName="BUSCAS" ref={containerRef}>
        <Tabs.Tab name="BUSCAS">
          <MainSceneMemo query={query} barRef={containerRef} />
        </Tabs.Tab>
        <Tabs.Tab name="PESSOAS">
          <UsersScene query={query} />
        </Tabs.Tab>
      </TabBar>
    </S.Container>
  );
}
