import {
  createContext,
  createRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { storage } from '../lib/storage';
import { ME } from '../services/users/query/me';
import { MeQuery } from '../__generated__/graphql';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  graphQLClient,
  makeGraphQLRequest,
  makeGraphQLRequestWithTimeout,
} from '../lib/graphQLClient';
import { useRequiredSubscriptions } from '../hooks/useRequiredSubscriptions';
import { View } from 'react-native';
import { Text } from '../components/Text';
import { atob } from 'react-native-quick-base64';
import { REFRESH_TOKEN } from '../services/auth/queries/refreshToken';
import { Loading } from '../components/Loading';
import { useTheme } from 'styled-components';
import { Button } from '../components/Button';

interface InternalAuthContextValue {
  signedIn: boolean;
  signin: (token: string, refreshToken: string) => void;
  signout: () => void;
}

interface AuthContextValue extends InternalAuthContextValue {
  user: MeQuery | undefined;
}

export const AuthContextRef = createRef<InternalAuthContextValue>();
export const AuthContext = createContext({} as AuthContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const [isValidating, setIsValidating] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean>(() => {
    const token = storage.getString('token');
    return !!token;
  });
  const [serverOffline, setServerOffline] = useState(false);
  const queryClient = useQueryClient();

  const signin = useCallback((token: string, refreshToken: string) => {
    storage.set('token', token);
    storage.set('refreshToken', refreshToken);
    setSignedIn(true);
  }, []);

  const signout = useCallback(() => {
    storage.delete('token');
    storage.delete('refreshToken');

    queryClient.clear();

    setSignedIn(false);
    setServerOffline(false);
  }, []);

  useImperativeHandle(AuthContextRef, () => ({
    signedIn,
    signin,
    signout,
  }));

  const {
    data: user,
    error,
    isError,
    isFetching,
    isRefetchError,
    refetch,
  } = useQuery({
    queryKey: ['me'],
    queryFn: () =>
      makeGraphQLRequestWithTimeout(
        makeGraphQLRequest<MeQuery>({ document: ME }),
        4000
      ),
    enabled: signedIn && !isValidating,
    retry: false,
  });

  useRequiredSubscriptions(signedIn && !isValidating);

  const handleJWTValidation = async () => {
    setIsValidating(true);
    setServerOffline(false);

    const token = storage.getString('token');
    if (!token) {
      signout();
      setIsValidating(false);
      return;
    }

    try {
      const payload = token.split('.')[1];
      const decoded: { exp: number } = JSON.parse(atob(payload));
      const now = Math.floor(Date.now() / 1000);
      const isExpired = decoded.exp < now;
      const isExpiringSoon = decoded.exp - now < 60 * 60 * 24 * 2;

      if (isExpired || isExpiringSoon) {
        const refreshToken = storage.getString('refreshToken');
        if (!refreshToken) {
          signout();
          setIsValidating(false);
          return;
        }

        const refreshPayload = refreshToken.split('.')[1];
        const decodedRefresh: { exp: number } = JSON.parse(
          atob(refreshPayload)
        );
        if (decodedRefresh.exp < now) {
          signout();
          setIsValidating(false);
          return;
        }

        try {
          const {
            refreshToken: { token: newToken, refreshToken: newRefresh },
          } = await graphQLClient.request({
            document: REFRESH_TOKEN,
            variables: { refreshToken },
          });

          storage.set('token', newToken);
          storage.set('refreshToken', newRefresh);
          graphQLClient.setHeader('authorization', `Bearer ${newToken}`);
          signin(newToken, newRefresh);
        } catch (e) {
          console.error('Error refreshing token', e);
          signout();
        }
      }
    } catch (e) {
      console.log('handleJwtValidationError', e);
      signout();
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    handleJWTValidation();
  }, []);

  useEffect(() => {
    if ((isError || isRefetchError) && signedIn) {
      setServerOffline(true);
    }
  }, [isError, signedIn]);

  const isLoadingScreen =
    isValidating || (signedIn && isFetching && !user && !error);

  // UI
  if (isLoadingScreen) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <Loading color={theme.colors.blue} size={48} />
      </View>
    );
  }

  if (serverOffline) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
          backgroundColor: 'white',
        }}
      >
        <Text weight="Semibold" color="black" align="center">
          Servidor indisponível. Verifique sua conexão e tente novamente.
        </Text>
        <Button
          style={{
            marginTop: 32,
          }}
          onPress={refetch}
        >
          <Text weight="Semibold" color="white">
            Tentar novamente
          </Text>
        </Button>
        <Button
          style={{
            marginTop: 32,
          }}
          onPress={signout}
        >
          <Text weight="Semibold" color="white">
            Voltar a tela de login
          </Text>
        </Button>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ signedIn, user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
