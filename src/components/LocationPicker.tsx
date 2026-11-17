import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './AppText';
import * as Location from 'expo-location';
import { alpha, colors, fonts, radius } from '../theme/tokens';
import { DEFAULT_CENTER } from '../utils/constants';
import { LeafletMap } from './map/LeafletMap';
import type { LeafletMapHandle } from './map/types';
import { Button } from './ui';

export interface Coords {
  lat: number;
  lng: number;
}

/** Equivalente del LocationMapPicker web (OpenStreetMap): toca el mapa o usa el GPS. */
export const LocationPicker: React.FC<{ value: Coords | null; onChange: (c: Coords) => void; error?: string }> = ({ value, onChange, error }) => {
  const mapRef = useRef<LeafletMapHandle>(null);
  const [locating, setLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [initial] = useState(() => (value ? { center: value, zoom: 16 } : { center: DEFAULT_CENTER, zoom: 12 }));

  const markers = useMemo(() => (value ? [{ id: 'sel', lat: value.lat, lng: value.lng, color: colors.accent }] : []), [value]);

  const useMyLocation = async () => {
    setGpsError(null);
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsError('Permiso de ubicación denegado. Toca el mapa para fijar el punto.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      onChange(c);
      mapRef.current?.flyTo(c.lat, c.lng, 17);
    } catch {
      setGpsError('No se pudo obtener tu ubicación.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <View>
      <Text style={styles.label}>Ubicación</Text>
      <View style={[styles.mapWrap, !!error && { borderColor: colors.error }]}>
        <LeafletMap
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialCenter={initial.center}
          initialZoom={initial.zoom}
          markers={markers}
          selectedId="sel"
          onPress={onChange}
        />
        {!value && (
          <View style={styles.banner} pointerEvents="none">
            <Text style={styles.bannerText}>Toca el mapa para marcar dónde está el problema</Text>
          </View>
        )}
      </View>
      <View style={styles.row}>
        <Text style={styles.coords}>{value ? `${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}` : 'Sin ubicación'}</Text>
        <Button title="Mi ubicación" icon="navigation" variant="secondary" size="sm" onPress={useMyLocation} isLoading={locating} />
      </View>
      {(error || gpsError) && <Text style={styles.error}>⚠ {error ?? gpsError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, marginBottom: 8 },
  mapWrap: {
    height: 260,
    borderRadius: radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface2,
  },
  banner: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    padding: 10,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: alpha(colors.surface, 0.95),
  },
  bannerText: { color: colors.text, fontFamily: fonts.body, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  coords: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13 },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13, marginTop: 6 },
});
