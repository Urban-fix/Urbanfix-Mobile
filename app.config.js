/**
 * Extiende app.json con valores que no deben ir en el repo.
 *
 * GOOGLE_MAPS_API_KEY: necesaria para que el mapa funcione en el APK de Android
 * (en Expo Go no hace falta). Se configura como variable de entorno en EAS:
 *   eas env:create --name GOOGLE_MAPS_API_KEY --value TU_KEY --environment preview --environment production --visibility sensitive
 */
module.exports = ({ config }) => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...(config.android?.config ?? {}),
        ...(googleMapsApiKey ? { googleMaps: { apiKey: googleMapsApiKey } } : {}),
      },
    },
  };
};
