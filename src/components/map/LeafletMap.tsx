import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { WebView, type WebViewMessageEvent, type WebViewProps } from 'react-native-webview';
import { colors } from '../../theme/tokens';
import { leafletHtml } from './leafletHtml';
import type { LeafletMapHandle, LeafletMapProps, MapMessage } from './types';

// Los tipos de WebView (componente de clase) no encajan con los tipos de React 19; se tipa a mano.
const WV = WebView as unknown as React.ComponentType<WebViewProps & { ref?: React.Ref<WebView> }>;

/**
 * Mapa OpenStreetMap (Leaflet) dentro de un WebView. No necesita API key.
 * Versión web: LeafletMap.web.tsx (iframe).
 */
export const LeafletMap = React.forwardRef<LeafletMapHandle, LeafletMapProps>(
  ({ initialCenter, initialZoom = 13, markers = [], selectedId = null, onPress, onMarkerPress, style }, ref) => {
    const webRef = useRef<WebView>(null);
    const [ready, setReady] = useState(false);

    // El HTML se arma una sola vez: cambiar el centro después recargaría el mapa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const html = useMemo(() => leafletHtml({ lat: initialCenter.lat, lng: initialCenter.lng, zoom: initialZoom }), []);

    const cmd = useCallback((c: object) => {
      webRef.current?.injectJavaScript(`window.__cmd && window.__cmd(${JSON.stringify(c)}); true;`);
    }, []);

    useImperativeHandle(ref, () => ({ flyTo: (lat, lng, zoom) => cmd({ type: 'fly', lat, lng, zoom }) }), [cmd]);

    useEffect(() => {
      if (ready) cmd({ type: 'markers', markers, selectedId });
    }, [ready, markers, selectedId, cmd]);

    const onMessage = (e: WebViewMessageEvent) => {
      let msg: MapMessage;
      try {
        msg = JSON.parse(e.nativeEvent.data);
      } catch {
        return;
      }
      if (msg.type === 'ready') setReady(true);
      if (msg.type === 'press') onPress?.({ lat: msg.lat, lng: msg.lng });
      if (msg.type === 'marker') onMarkerPress?.(msg.id);
    };

    return (
      <View style={[{ overflow: 'hidden', backgroundColor: colors.surface2 }, style]}>
        <WV
          ref={webRef}
          originWhitelist={['*']}
          source={{ html, baseUrl: 'https://localhost/' }}
          onMessage={onMessage}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          overScrollMode="never"
          setSupportMultipleWindows={false}
          style={{ flex: 1, backgroundColor: colors.surface2 }}
        />
      </View>
    );
  },
);
LeafletMap.displayName = 'LeafletMap';
