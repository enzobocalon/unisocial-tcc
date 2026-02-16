import styled from 'styled-components/native';

interface ContainerProps {
  hasChildrenReply?: boolean;
  isParent?: boolean;
}

export const Container = styled.View<ContainerProps>`
  flex-direction: row;
  padding: ${({ hasChildrenReply, isParent }) =>
    hasChildrenReply || isParent ? '8px 16px' : '0'};
  gap: 8px;
`;

export const Wrapper = styled.View`
  flex: 1;
`;

export const Content = styled.View`
  background-color: ${({ theme }) => theme.colors.fields};
  border-radius: 8px;
  padding: 8px;
  width: 100%;
`;

export const ActionsStatsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
`;

export const Stats = styled.View`
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;

export const ActionsStatsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const RepliesContainer = styled.View`
  margin-top: 8px;
`;

export const Touchable = styled.TouchableOpacity`
  margin-top: 4px;
  margin-bottom: 4px;
`;

interface PopupContainerProps {
  isParent: boolean;
}

export const PopupContainer = styled.View<PopupContainerProps>`
  z-index: 1000;
  position: absolute;
  top: 32px;
  left: ${({ isParent }) => (isParent ? '56px' : '40px')};
`;
