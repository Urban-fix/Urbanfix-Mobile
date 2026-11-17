import React, { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './AppText';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { colors, fonts } from '../theme/tokens';
import { API_URL, FALLBACK_IMAGE } from '../utils/constants';

/**
 * El backend guarda la foto con la dirección completa del servidor
 * (p. ej. https://urbanfix-backend-...-3-80-67-130.sslip.io/uploads/abc.png).
 * Como la IP del servidor cambia, esa dirección queda vieja: se reescribe
 * con la URL actual del backend para que la foto siga cargando.
 */
export const resolveFotoUrl = (url?: string | null): string | null => {
  if (!url) return null;
  const i = url.indexOf('/uploads/');
  if (i >= 0) return API_URL.replace(/\/+$/, '') + url.slice(i);
  return url;
};

/**
 * Foto de un reporte. Si no tiene foto usa la imagen genérica (igual que el web);
 * si la foto no carga (borrada o sin internet), muestra un aviso en vez de un recuadro vacío.
 */
export const ReporteImage: React.FC<{ fotoUrl?: string | null; style?: StyleProp<ViewStyle>; compact?: boolean }> = ({ fotoUrl, style, compact }) => {
  const uri = resolveFotoUrl(fotoUrl) ?? FALLBACK_IMAGE;
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [uri]);

  return (
    <View style={[styles.box, style]}>
      {failed ? (
        <View style={styles.placeholder}>
          <Feather name="image" size={compact ? 18 : 28} color={colors.textMuted} />
          {!compact && (
            <Text style={styles.text} maxFontSizeMultiplier={1.3}>
              Foto no disponible
            </Text>
          )}
        </View>
      ) : (
        <Image source={uri} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} onError={() => setFailed(true)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: { overflow: 'hidden', backgroundColor: colors.surface2 },
  placeholder: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: 6 },
  text: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 13 },
});
