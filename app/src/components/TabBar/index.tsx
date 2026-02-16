import {
  CollapsibleProps,
  CollapsibleRef,
  TabBarProps,
} from 'react-native-collapsible-tab-view/lib/typescript/src/types';
import * as S from './styles';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import { useTabBar } from './useTabBar';
import { Text } from '../Text';
import { forwardRef, useCallback } from 'react';

export const TabBar = forwardRef<CollapsibleRef, CollapsibleProps>(
  (props, ref) => {
    const { containerRef, theme, focusedItem, getItemStyle } = useTabBar(
      ref,
      props.initialTabName
    );

    const renderTabBar = useCallback(
      (tabBarProps: TabBarProps) => (
        <MaterialTabBar
          {...tabBarProps}
          indicatorStyle={{
            backgroundColor: theme.colors.blue,
          }}
          TabItemComponent={({ name, label }) => {
            const itemStyle = getItemStyle(name);
            return (
              <S.Item style={itemStyle}>
                <S.Pressable
                  onPress={() => {
                    containerRef.current?.jumpToTab(name);
                  }}
                >
                  <Text
                    size={14}
                    weight="Semibold"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {label.toString() || name}
                  </Text>
                </S.Pressable>
              </S.Item>
            );
          }}
        />
      ),
      [containerRef, theme, focusedItem.value]
    );

    return (
      <Tabs.Container
        renderHeader={props.renderHeader}
        headerHeight={props.headerHeight}
        minHeaderHeight={props.minHeaderHeight}
        allowHeaderOverscroll={props.allowHeaderOverscroll}
        headerContainerStyle={{
          margin: 0,
          elevation: 0,
        }}
        ref={containerRef}
        renderTabBar={renderTabBar}
        onTabChange={({ tabName }) => {
          focusedItem.value = tabName;
        }}
        {...props}
      >
        {props.children}
      </Tabs.Container>
    );
  }
);

TabBar.displayName = 'TabBar';
