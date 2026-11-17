import Constants from 'expo-constants';
import { colors } from '../theme/tokens';
import type { EstadoReporte } from '../types/reporte.types';

/**
 * URL del backend. Se cambia en UN solo lugar: app.json → expo.extra.apiUrl.
 * Esa URL queda guardada dentro del APK al compilar.
 *
 * Solo para desarrollo: EXPO_PUBLIC_API_URL en un archivo .env la reemplaza
 * (p. ej. para usar un backend local con la IP de tu PC).
 */
export const API_URL: string =
  process.env.EXPO_PUBLIC_API_URL || ((Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? '');

// Mismos nombres que el enum EstadoReporte del backend
export const ESTADOS_REPORTE = {
  REPORTADO: 'REPORTADO',
  EN_PROCESO: 'EN_PROCESO',
  RESUELTO: 'RESUELTO',
  RECHAZADO: 'RECHAZADO',
} as const;

export const ESTADO_COLOR: Record<EstadoReporte, string> = {
  REPORTADO: colors.warning,
  EN_PROCESO: colors.info,
  RESUELTO: colors.success,
  RECHAZADO: colors.error,
};

export const ESTADO_ICON: Record<EstadoReporte, 'alert-circle' | 'clock' | 'check-circle' | 'x-circle'> = {
  REPORTADO: 'alert-circle',
  EN_PROCESO: 'clock',
  RESUELTO: 'check-circle',
  RECHAZADO: 'x-circle',
};

const ESTADO_LABEL: Record<string, string> = {
  REPORTADO: 'Reportado',
  EN_PROCESO: 'En proceso',
  RESUELTO: 'Resuelto',
  RECHAZADO: 'Rechazado',
};

/** Nombre legible del estado. Si el backend agrega uno nuevo, se muestra igual en vez de quedar vacío. */
export const estadoLabel = (estado: string) => ESTADO_LABEL[estado] ?? (estado ?? '').replace(/_/g, ' ').toLowerCase();

/** Imagen por defecto cuando el reporte no tiene foto (misma que usa el web). */
export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80';

/** Centro por defecto del mapa: Lima. */
export const DEFAULT_CENTER = { lat: -12.0464, lng: -77.0428 };
