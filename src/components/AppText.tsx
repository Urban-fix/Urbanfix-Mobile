import React from 'react';
import { Text as RNText, TextInput as RNTextInput } from 'react-native';

/**
 * Cuánto puede crecer la letra si el celular tiene "texto grande" en accesibilidad
 * (o "tamaño de pantalla" aumentado en Android). Se respeta la preferencia del usuario,
 * pero con un tope para que el texto no se salga de botones, campos y la barra de pestañas.
 */
export const MAX_FONT_SCALE = 1.3;

/** Text de React Native con el tope de agrandado. Usar este en lugar del de 'react-native'. */
export function Text(props: React.ComponentProps<typeof RNText>) {
  return <RNText maxFontSizeMultiplier={MAX_FONT_SCALE} {...props} />;
}

/** TextInput con el mismo tope de agrandado. */
export function TextInput(props: React.ComponentProps<typeof RNTextInput>) {
  return <RNTextInput maxFontSizeMultiplier={MAX_FONT_SCALE} {...props} />;
}
