import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Login con Google usando @react-native-google-signin/google-signin.
 *
 * Se pide el idToken con el MISMO Web Client ID que usa el frontend web
 * (VITE_GOOGLE_CLIENT_ID), así el backend valida el token igual que en el web.
 *
 * El módulo es nativo: no existe dentro de Expo Go, solo en el APK / development build.
 * Por eso se carga con require() solo cuando está disponible.
 */

const extra = (Constants.expoConfig?.extra ?? {}) as { googleWebClientId?: string; googleIosClientId?: string };
const WEB_CLIENT_ID = extra.googleWebClientId?.trim() ?? '';
const IOS_CLIENT_ID = extra.googleIosClientId?.trim() || undefined;

export type GoogleSignInStatus = 'ok' | 'expo-go' | 'web' | 'not-configured';

export const googleSignInStatus = (): GoogleSignInStatus => {
  if (Platform.OS === 'web') return 'web';
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return 'expo-go';
  if (!WEB_CLIENT_ID) return 'not-configured';
  return 'ok';
};

export const GOOGLE_STATUS_MESSAGE: Record<Exclude<GoogleSignInStatus, 'ok'>, string> = {
  'expo-go': 'El login con Google funciona en el APK, no dentro de Expo Go.',
  web: 'El login con Google solo está disponible en la app de iOS/Android.',
  'not-configured': 'Falta configurar el Google Client ID en app.json (extra.googleWebClientId).',
};

type GoogleModule = typeof import('@react-native-google-signin/google-signin');
let mod: GoogleModule | null = null;
let configured = false;

const load = (): GoogleModule => {
  if (!mod) mod = require('@react-native-google-signin/google-signin') as GoogleModule;
  if (!configured) {
    mod.GoogleSignin.configure({ webClientId: WEB_CLIENT_ID, iosClientId: IOS_CLIENT_ID, scopes: ['profile', 'email'] });
    configured = true;
  }
  return mod;
};

/** Abre el selector de cuentas de Google. Devuelve el idToken, o null si el usuario canceló. */
export const getGoogleIdToken = async (): Promise<string | null> => {
  const status = googleSignInStatus();
  if (status !== 'ok') throw new Error(GOOGLE_STATUS_MESSAGE[status]);

  const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } = load();
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const res = await GoogleSignin.signIn();
    if (!isSuccessResponse(res)) return null; // canceló
    if (!res.data.idToken) throw new Error('Google no devolvió el token. Revisa el Web Client ID.');
    return res.data.idToken;
  } catch (e) {
    if (isErrorWithCode(e)) {
      if (e.code === statusCodes.IN_PROGRESS) return null;
      if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) throw new Error('Google Play Services no está disponible en este dispositivo.');
    }
    throw e instanceof Error ? e : new Error('Error al autenticar con Google');
  }
};

/** Cierra la sesión de Google para que la próxima vez pida elegir cuenta. */
export const googleSignOut = async () => {
  if (googleSignInStatus() !== 'ok') return;
  try {
    await load().GoogleSignin.signOut();
  } catch {
    // no es crítico
  }
};
