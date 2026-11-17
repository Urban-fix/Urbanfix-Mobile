/**
 * Tokens de diseño de UrbanFix.
 * Copiados 1:1 de `src/index.css` (@theme) del frontend web para mantener
 * el mismo look: fondo azul marino, superficies pizarra y acento azul #0B63FF.
 */
export const colors = {
  bg: '#0F172A',
  surface: '#1A2337',
  surface2: '#232D40',
  line: '#334155',

  text: '#E2E8F0',
  textSecondary: '#CBD5E1',
  textMuted: '#9DA8B7',

  accent: '#0B63FF',
  accentHover: '#2B77FD',
  accentActive: '#0952D6',
  accentGlow: '#5B95FF',
  onAccent: '#FFFFFF',

  panelLight: '#E2E8F0',
  onPanel: '#0F172A',
  onPanelMuted: '#475569',

  success: '#22C55E',
  warning: '#F2C14E',
  error: '#FF6B5E',
  info: '#38BDF8',
} as const;

/** Mezcla un color hex con transparencia (equivalente a `bg-accent/15`). */
export const alpha = (hex: string, opacity: number) => {
  const a = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};

export const radius = 4; // --radius-md del web

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  gutter: 16, // --gutter-mobile
} as const;

export const fonts = {
  heading: 'Anton_400Regular',
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  elevated: {
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
} as const;

export type Tone = 'accent' | 'warning' | 'info' | 'success' | 'error';

export const toneColor: Record<Tone, string> = {
  accent: colors.accent,
  warning: colors.warning,
  info: colors.info,
  success: colors.success,
  error: colors.error,
};
