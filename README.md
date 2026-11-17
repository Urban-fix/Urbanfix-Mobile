# UrbanFix Mobile (Expo)

Versión móvil de UrbanFix para iOS y Android, con el mismo diseño del frontend web
(fondo carbón `#1A1A1A`, superficies `#2B2B2B`, acento lima `#D4F58C`, títulos en **Anton** y texto en **Inter**).

- Expo SDK 58 · React Native 0.88 · Expo Router (rutas en `src/app/`)
- Consume el mismo backend Spring Boot (`/api/v1/...`)

## Cómo correrlo

```bash
npm install
npx expo start            # escanea el QR con Expo Go o pulsa a / i
```

La URL del backend se configura en **un solo lugar**: `app.json` → `expo.extra.apiUrl`.

Para desarrollo con un backend local, copia `.env.example` a `.env` y cambia `EXPO_PUBLIC_API_URL`
(en el celular `localhost` es el propio celular: usa la IP de tu PC en la red, o `10.0.2.2` en el emulador de Android).

## Pantallas

| Web | Móvil |
| --- | --- |
| Login / Register / PasswordReset | `(auth)/login`, `register`, `password-reset` |
| Dashboard | pestaña **Inicio** |
| Informes (ReporteList) | pestaña **Informes** (filtros por estado, categoría, zona y búsqueda) |
| ReporteCreate | pestaña **+** (cámara, galería o URL; ubicación por GPS o tocando el mapa) |
| Mapa | pestaña **Mapa** (pines por estado + leyenda) |
| Perfil + MisReportes | pestaña **Perfil** (editar / eliminar reportes, cerrar sesión) |
| ReporteDetail / ReporteEdit | `reportes/[id]`, `reportes/[id]/editar` |

## Autenticación

El web usa cookies HttpOnly; en móvil no hay navegador que las maneje, así que el
`accessToken` y `refreshToken` del login se guardan cifrados con `expo-secure-store`
y se envían como `Authorization: Bearer …` (el `JwtAuthenticationFilter` ya lo acepta).
Si el token expira, se llama a `/auth/refresh` enviando el refresh token en el header `Cookie`.

## Estructura

```
src/
  app/                 rutas (Expo Router)
    (auth)/            login, registro, recuperar contraseña
    (app)/(tabs)/      inicio, informes, crear, mapa, perfil
    (app)/reportes/    detalle y edición
  api/                 axios + endpoints + almacenamiento de tokens
  components/          UI reutilizable (Button, Input, Select, StatusBadge, ReporteCard…)
  context/             AuthContext
  hooks/               carga de datos
  theme/tokens.ts      colores/tipografía copiados de src/index.css del web
```

## Generar el APK (Android)

Se compila en la nube con [EAS Build](https://docs.expo.dev/build/introduction/) (cuenta gratuita de Expo).

1. Instala la herramienta e inicia sesión:
   ```bash
   npm install -g eas-cli
   eas login
   ```
2. Vincula el proyecto con tu cuenta de Expo (solo la primera vez; agrega el `projectId` a `app.json`):
   ```bash
   eas init
   ```
3. Genera el APK:
   ```bash
   eas build --platform android --profile preview
   ```
   Al terminar, EAS da un link y un QR para descargar e instalar el APK en cualquier Android.

Perfiles en `eas.json`:
- `preview`: APK para instalar directo (pruebas y presentación).
- `production`: AAB para subir a Google Play (incrementa la versión automáticamente).

### Si cambia la URL del backend

La URL queda guardada dentro del APK. Si el servidor cambia de dirección, hay que actualizar
`expo.extra.apiUrl` en `app.json` y volver a generar el APK. Para evitarlo, el backend debe tener una
dirección fija (Elastic IP o dominio propio).

## Mapa

Los mapas usan **OpenStreetMap con Leaflet**, igual que el frontend web (dentro de un WebView).
No necesitan API key ni cuenta de Google; solo conexión a internet.

## Notas


- La app está pensada para iOS/Android; la versión web solo sirve para revisar pantallas (ahí el mapa va en un iframe).
