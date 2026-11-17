import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { colors } from '../../theme/tokens';
import { leafletHtml } from './leafletHtml';
import type { LeafletMapHandle, LeafletMapProps, MapMessage } from './types';

type MapWindow = Window & { __cmd?: (c: object) => void };

/** Versión web del mapa: el mismo HTML de Leaflet dentro de un iframe. */
export const LeafletMap = React.forwardRef<LeafletMapHandle, LeafletMapProps>(
  ({ initialCenter, initialZoom = 13, markers = [], selectedId = null, onPress, onMarkerPress, style }, ref) => {
    const frameRef = useRef<HTMLIFrameElement | null>(null);
    const [ready, setReady] = useState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const html = useMemo(() => leafletHtml({ lat: initialCenter.lat, lng: initialCenter.lng, zoom: initialZoom }), []);

    const cmd = (c: object) => (frameRef.current?.contentWindow as MapWindow | null)?.__cmd?.(c);

    useImperativeHandle(ref, () => ({ flyTo: (lat, lng, zoom) => cmd({ type: 'fly', lat, lng, zoom }) }));

    const handlers = useRef({ onPress, onMarkerPress });
    handlers.current = { onPress, onMarkerPress };

    useEffect(() => {
      const listener = (e: MessageEvent) => {
        if (e.source !== frameRef.current?.contentWindow || typeof e.data !== 'string') return;
        let msg: MapMessage;
        try {
          msg = JSON.parse(e.data);
        } catch {
          return;
        }
        if (msg.type === 'ready') setReady(true);
        if (msg.type === 'press') handlers.current.onPress?.({ lat: msg.lat, lng: msg.lng });
        if (msg.type === 'marker') handlers.current.onMarkerPress?.(msg.id);
      };
      window.addEventListener('message', listener);
      return () => window.removeEventListener('message', listener);
    }, []);

    useEffect(() => {
      if (ready) cmd({ type: 'markers', markers, selectedId });
    }, [ready, markers, selectedId]);

    return (
      <View style={[{ overflow: 'hidden', backgroundColor: colors.surface2 }, style]}>
        {React.createElement('iframe', {
          ref: frameRef,
          srcDoc: html,
          title: 'Mapa',
          style: { border: 0, width: '100%', height: '100%', display: 'block' },
        })}
      </View>
    );
  },
);
LeafletMap.displayName = 'LeafletMap';
