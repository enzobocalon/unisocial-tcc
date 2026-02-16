import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  position: relative;
`;

export const Header = styled.View`
  flex: 1;
  position: absolute;
  flex-direction: row;
  top: 16px;
  width: 100%;
  height: 56px;
  left: 0;
  right: 0;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  z-index: 10000;
`;

export const HeaderItemsContainer = styled.View`
  width: 36px;
  height: 36px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 18px;
`;

export const HeaderLocationImageContainer = styled.View``;
export const HeaderLocationTextContainer = styled.View`
  flex: 1;
  align-items: center;
`;

interface ContainerHeaderMainLocationProps {
  enabled: boolean;
}

export const ContainerHeaderMainLocation = styled.View<ContainerHeaderMainLocationProps>`
  justify-content: space-between;
  align-items: center;
  width: 50%;
  flex-direction: row;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 4px;
  border-radius: 24px;
`;

export const MapContainer = styled.View`
  flex: 1;
`;

// Disabled Container

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 100%;
  height: ${Dimensions.get('window').height}px;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const Wrapper = styled.View`
  background-color: white;
  padding: 32px;
  border-radius: 16px;
`;

export const CrossContainer = styled.View`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.blue};
  background-color: white;
`;
