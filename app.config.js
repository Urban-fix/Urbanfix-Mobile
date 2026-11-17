/**
 * Extiende app.json.
 *
 * Login con Google en iOS: el plugin de @react-native-google-signin necesita el
 * "iOS URL scheme" (el iOS Client ID al revés, empieza con com.googleusercontent.apps.).
 * Se agrega solo si existe la variable GOOGLE_IOS_URL_SCHEME, para que el APK de Android
 * se pueda compilar sin configurar nada de iOS.
 */
module.exports = ({ config }) => {
  const iosUrlScheme = process.env.GOOGLE_IOS_URL_SCHEME;
  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      ...(iosUrlScheme ? [['@react-native-google-signin/google-signin', { iosUrlScheme }]] : []),
    ],
  };
};
