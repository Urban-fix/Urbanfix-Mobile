import type { StyleProp, ViewStyle } from 'react-native';

export interface MapMarker {
  id: string | number;
  lat: number;
  lng: number;
  color: string;
}

export interface LeafletMapProps {
  /** Centro inicial del mapa (solo se usa al montar). */
  initialCenter: { lat: number; lng: number };
  initialZoom?: number;
  markers?: MapMarker[];
  selectedId?: string | number | null;
  onPress?: (coords: { lat: number; lng: number }) => void;
  onMarkerPress?: (id: string | number) => void;
  style?: StyleProp<ViewStyle>;
}

export interface LeafletMapHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
}

export type MapMessage =
  | { type: 'ready' }
  | { type: 'error' }
  | { type: 'press'; lat: number; lng: number }
  | { type: 'marker'; id: string | number };
