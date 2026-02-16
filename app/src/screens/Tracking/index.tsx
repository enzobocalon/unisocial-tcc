import * as S from './styles';
import { Image, TouchableOpacity } from 'react-native';
import Mapbox, {
  MapView,
  Camera,
  FillExtrusionLayer,
  MarkerView,
  UserLocation,
} from '@rnmapbox/maps';
import { env } from '../../lib/env';
import { Avatar } from '../../components/Avatar';
import { Text } from '../../components/Text';
import { Marker } from '../../components/Marker';
import { DotsVertical } from '../../components/Icons/DotsVertical';
import { TrackingMenu } from './components/Menu';
import { BottomSheet } from '../../components/BottomSheet';
import { useTracking } from './useTracking';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { TrackingConfig } from './components/Config';

Mapbox.setAccessToken(env.MAPBOX_TOKEN);

const layerStyles = {
  building: {
    fillExtrusionColor: '#aaa',

    fillExtrusionHeight: [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height'],
    ],

    fillExtrusionBase: [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height'],
    ],

    fillExtrusionOpacity: 0.6,
  },
};

const bounds = {
  ne: [-49.9145, -20.3845],
  sw: [-50.0414, -20.4306],
};

export function Tracking() {
  const {
    markers,
    optionsRef,
    theme,
    location,
    handleUserLocation,
    BUILDINGS,
    currentBuilding,
    enabled,
    toggleEnabled,
    isPending,
    configRef,
    user,
    isValidating,
    isValidLocation,
  } = useTracking();

  const renderOverlay = () => {
    // 1. Ainda está validando
    if (isValidating) {
      return (
        <S.Overlay>
          <S.Wrapper>
            <Loading />
            <Text weight="Bold" size={20} align="center">
              Validando localização...
            </Text>
            <Text color={theme.colors.lightGray} style={{ marginTop: 8 }}>
              Verificando se você está dentro do campus universitário.
            </Text>
          </S.Wrapper>
        </S.Overlay>
      );
    }

    // 2. Localização inválida (fora do campus)
    if (!isValidLocation) {
      return (
        <S.Overlay>
          <S.Wrapper>
            <Text weight="Bold" size={20} align="center">
              Fora do campus
            </Text>
            <Text color={theme.colors.lightGray} style={{ marginTop: 8 }}>
              Você não está dentro do campus universitário. O rastreamento só
              funciona dentro da área permitida.
            </Text>
            <Button
              style={{ marginTop: 16 }}
              onPress={toggleEnabled}
              disabled={isPending}
            >
              {isPending ? (
                <Loading />
              ) : (
                <Text color="white">Tentar novamente</Text>
              )}
            </Button>
          </S.Wrapper>
        </S.Overlay>
      );
    }

    // 3. Localização válida, mas tracking desabilitado (config off)
    if (isValidLocation && !enabled) {
      return (
        <S.Overlay>
          <S.Wrapper>
            <Text weight="Bold" size={20} align="center">
              Rastreio desativado
            </Text>
            <Text color={theme.colors.lightGray} style={{ marginTop: 8 }}>
              Você está no campus, mas o compartilhamento de localização está
              desabilitado.
            </Text>
            <Button
              style={{ marginTop: 16 }}
              onPress={toggleEnabled}
              disabled={isPending}
            >
              {isPending ? (
                <Loading />
              ) : (
                <Text color="white">Ativar rastreio</Text>
              )}
            </Button>
          </S.Wrapper>
        </S.Overlay>
      );
    }
    return null;
  };

  return (
    <S.Container style={{ flex: 1 }}>
      <S.Header>
        <S.HeaderItemsContainer>
          <Avatar size={32} source={user?.me.avatar} />
        </S.HeaderItemsContainer>
        <S.ContainerHeaderMainLocation enabled={enabled}>
          <S.HeaderLocationImageContainer>
            <Image
              source={
                currentBuilding
                  ? BUILDINGS[currentBuilding as keyof typeof BUILDINGS].image
                  : BUILDINGS.campus.image
              }
              width={32}
              height={32}
              style={{
                objectFit: 'cover',
                width: 32,
                height: 32,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: theme.colors.blue,
              }}
            />
          </S.HeaderLocationImageContainer>
          <S.HeaderLocationTextContainer>
            <Text weight="Semibold" color="white" numberOfLines={1}>
              {currentBuilding || 'Cidade Universitária'}
            </Text>
          </S.HeaderLocationTextContainer>
        </S.ContainerHeaderMainLocation>

        <S.HeaderItemsContainer>
          <TouchableOpacity onPress={() => optionsRef.current?.present()}>
            <DotsVertical size={24} color="white" />
          </TouchableOpacity>
          <BottomSheet ref={optionsRef} snapPoints={['25%']}>
            <TrackingMenu
              enabled={enabled}
              toggleEnable={toggleEnabled}
              openConfig={() => configRef.current?.present()}
              bottomSheetRef={optionsRef}
            />
          </BottomSheet>
        </S.HeaderItemsContainer>
      </S.Header>

      <S.MapContainer>
        {renderOverlay()}

        <MapView
          style={{ flex: 1 }}
          scaleBarEnabled={false}
          compassEnabled={false}
        >
          {markers?.map((marker) => (
            <MarkerView
              key={marker.id}
              coordinate={marker.location}
              anchor={{ x: 0.5, y: 0.5 }}
              allowOverlap={true}
              isSelected={false}
            >
              <Marker avatar={marker.avatar} />
            </MarkerView>
          ))}

          {location && (
            <MarkerView
              coordinate={[location.longitude, location.latitude]}
              anchor={{ x: 0.5, y: 0.5 }}
              allowOverlap={true}
              isSelected={false}
            >
              <Marker highlight avatar={user?.me.avatar as string} />
            </MarkerView>
          )}

          <Camera
            zoomLevel={18}
            followUserLocation
            followZoomLevel={18}
            maxBounds={bounds}
            centerCoordinate={[-49.9306, -20.4266]}
            defaultSettings={{
              centerCoordinate: [-49.9306, -20.4266],
              zoomLevel: 18,
            }}
            pitch={45}
            followPitch={45}
          />

          <UserLocation
            visible={false}
            onUpdate={handleUserLocation}
            minDisplacement={10}
          />

          <FillExtrusionLayer
            maxZoomLevel={50}
            minZoomLevel={16}
            id="building3d"
            sourceLayerID="building"
            style={layerStyles.building}
          />
        </MapView>
      </S.MapContainer>

      <BottomSheet ref={configRef} snapPoints={['50%', '100%']}>
        <TrackingConfig />
      </BottomSheet>
    </S.Container>
  );
}
