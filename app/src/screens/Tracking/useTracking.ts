import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Mapbox, { Location, locationManager } from '@rnmapbox/maps';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import { useSubscription } from '../../hooks/useSubscription';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_TRACKING_DATA } from '../../services/tracking/queries/getTrackingData';
import {
  GetTrackingDataQuery,
  InvalidateTrackingMutation,
  SendTrackingDataMutation,
  TrackingSubscription,
  TrackingSubscriptionVariables,
} from '../../__generated__/graphql';
import { Marker } from '../../types/Marker';
import { TRACKING_SUBSCRIPTION } from '../../services/tracking/subscriptions/tracking';
import { SEND_TRACKING_DATA } from '../../services/tracking/mutation/sendTrackingData';
import { useBuildingLocation } from '../../hooks/useBuildingLocation';
import Toast from 'react-native-toast-message';
import { storage } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import { INVALIDATE_TRACKING } from '../../services/tracking/mutation/invalidateTracking';

export function useTracking() {
  const { user } = useAuth();
  const [currentBuilding, setCurrentBuilding] = useState<
    string | null | undefined
  >(null);
  const optionsRef = useRef<BottomSheetModal | null>(null);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [trackingConfig, setTrackingConfig] = useState<boolean>(() => {
    const storedValue = storage.getBoolean(
      '@tracking_config:shouldEnableTracking'
    );
    return storedValue !== null && storedValue !== undefined
      ? storedValue
      : true;
  });

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [isValidLocation, setIsValidLocation] = useState<boolean>(false); // Se passou na validação
  const theme = useTheme();
  const configRef = useRef<BottomSheetModal | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();
  const { BUILDINGS } = useBuildingLocation();

  async function requestAndroidLocationPermissions() {
    try {
      const granted = await Mapbox.requestAndroidLocationPermissions();
      if (!granted) {
        console.error('Location permissions denied');
        setHasPermission(false);
      } else {
        setHasPermission(true);
        const lastKnownLocation = await locationManager.getLastKnownLocation();
        if (
          lastKnownLocation?.coords.latitude &&
          lastKnownLocation?.coords.longitude
        ) {
          setLocation({
            latitude: lastKnownLocation?.coords.latitude,
            longitude: lastKnownLocation?.coords.longitude,
          });
        }
      }
    } catch (error) {
      console.error('Error requesting location permissions', error);
    }
  }

  const { data: markers, refetch } = useQuery({
    queryKey: ['tracking'],
    queryFn: async () => {
      const { getTrackingData: data } =
        await makeGraphQLRequest<GetTrackingDataQuery>({
          document: GET_TRACKING_DATA,
        });
      return data.map((item) => ({
        ...item,
        location: [item.longitude, item.latitude],
      })) as Marker[];
    },
    staleTime: Infinity,
    enabled: enabled && isValidLocation && location !== null && hasPermission,
  });

  useEffect(() => {
    setLocation(null);
    requestAndroidLocationPermissions();
  }, []);

  const disableTracking = useCallback(() => {
    setEnabled(false);
    setCurrentBuilding(null);
    queryClient.setQueryData(['tracking'], []);
    setIsValidLocation(false);
    Toast.show({
      type: 'error',
      text1: 'Sua localização é inválida',
      text2: 'Você provavelmente não está dentro do campus.',
    });
    return;
  }, []);

  const { mutateAsync: sendLocation, isPending } = useMutation({
    mutationFn: async (scopedLocation?: Mapbox.Location | void) => {
      if (!location && !scopedLocation) return;
      const { sendTrackingData: data } =
        await makeGraphQLRequest<SendTrackingDataMutation>({
          document: SEND_TRACKING_DATA,
          variables: {
            latitude: scopedLocation
              ? scopedLocation.coords.latitude
              : location?.latitude,
            longitude: scopedLocation
              ? scopedLocation.coords.longitude
              : location?.longitude,
          },
        });
      if (!data || (data?.latitude === -999 && data?.longitude === -999)) {
        disableTracking();
        return null;
      }
      setCurrentBuilding(data.building);
      return data;
    },
  });

  const { mutateAsync: invalidateTracking } = useMutation({
    mutationFn: async () => {
      const data = await makeGraphQLRequest<InvalidateTrackingMutation>({
        document: INVALIDATE_TRACKING,
      });
      return data.invalidateTracking;
    },
  });

  const toggleEnabled = useCallback(async () => {
    if (!enabled) {
      // Sempre validar antes de ativar
      setIsValidating(true);
      try {
        const data = await sendLocation();
        if (!data) {
          // Localização inválida
          setIsValidLocation(false);
          setEnabled(false);
          setTrackingConfig(false);
          queryClient.setQueryData(['tracking'], []);
          return;
        }
        // Localização válida
        setIsValidLocation(true);
        setEnabled(true);
        setTrackingConfig(true);
        await refetch();
        storage.set('@tracking_config:shouldEnableTracking', true);
      } catch (error) {
        console.error('Error enabling tracking:', error);
        setIsValidLocation(false);
        setEnabled(false);
        setTrackingConfig(false);
        queryClient.setQueryData(['tracking'], []);
      } finally {
        setIsValidating(false);
      }
    } else {
      await invalidateTracking();
      setEnabled(false);
      setTrackingConfig(false);
      setIsValidLocation(false);
      queryClient.setQueryData(['tracking'], []);
    }
  }, [enabled, sendLocation, invalidateTracking, queryClient]);

  const handleLocationChange = useCallback(
    (location: TrackingSubscription['tracking'] | null) => {
      if (!location) return;

      queryClient.setQueryData(['tracking'], (oldData: Marker[] = []) => {
        const markersMap = new Map(oldData.map((item) => [item.id, item]));
        if (location.longitude === -999 || location.latitude === -999) {
          markersMap.delete(location.id);
        } else {
          const updatedItem = {
            ...location,
            location: [location.longitude, location.latitude],
          } as Marker;

          markersMap.set(location.id, updatedItem);
        }

        return Array.from(markersMap.values());
      });
    },
    [queryClient]
  );

  const handleUserLocation = useCallback(
    (location: Location) => {
      if (!hasPermission) return;
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (!enabled) return;
      sendLocation(location);
    },
    [enabled, sendLocation, hasPermission]
  );

  useEffect(() => {
    const validateLocation = async () => {
      if (!location || !isValidating || !hasPermission) {
        return;
      }

      try {
        const result = await sendLocation();
        if (result) {
          // Localização válida (dentro do campus)
          setIsValidLocation(true);

          if (trackingConfig && result) {
            setEnabled(true);
          } else {
            setEnabled(false);
          }
        } else {
          setIsValidLocation(false);
          setEnabled(false);
        }
      } catch (error) {
        console.error('erro useTracking:', error);
        setIsValidLocation(false);
        setEnabled(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateLocation();
  }, [location, isValidating, trackingConfig, sendLocation, hasPermission]);

  // subs
  useSubscription<TrackingSubscription, TrackingSubscriptionVariables>({
    request: {
      query: TRACKING_SUBSCRIPTION,
    },
    connectionParams: {
      isStatus: false,
      isTracking: true,
    },
    onData: (data) => {
      if (!data || !data.tracking) return;
      handleLocationChange(data.tracking);
    },
    onError: (error) => {
      console.log('error sub tracking', error);
    },
    enabled: enabled,
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (enabled && isFocused) {
      interval = setInterval(() => {
        sendLocation();
      }, 30 * 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [enabled, isFocused, sendLocation]);

  return {
    optionsRef,
    theme,
    markers,
    location,
    handleLocationChange,
    handleUserLocation,
    BUILDINGS,
    enabled,
    toggleEnabled,
    isPending,
    configRef,
    user,
    currentBuilding,
    isValidating,
    isValidLocation,
    hasPermission,
  };
}
