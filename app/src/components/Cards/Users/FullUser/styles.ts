import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

export const Container = styled.View`
  width: ${Dimensions.get('window').width - 96}px;
  height: ${Dimensions.get('window').width * 0.65}px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  margin-right: 8px;
  overflow: hidden;
`;

export const BannerContainer = styled.View`
  width: 100%;
  max-height: 40%;
  background-color: ${({ theme }) => theme.colors.gray};
`;

export const ImageContainer = styled.View`
  position: absolute;
  top: 40%;
  left: 16px;
  transform: translateY(-30px);
  z-index: 1000;
`;

export const UserInfoContainer = styled.View`
  flex: 1;
`;

export const ActionContainer = styled.View`
  padding: 8px 16px;
  align-items: flex-end;
`;

export const UserInfoWrapper = styled.View`
  margin-top: -16px;
  padding: 0 16px;
`;
