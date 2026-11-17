import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api/client';
import { getGoogleIdToken } from '../auth/googleSignIn';
import { useToast } from './Toast';
import { Divider } from './ui';

/**
 * Botón "Continuar con Google" + separador ("o continúa con" / "o regístrate con"),
 * en el mismo lugar que el web (arriba del formulario).
 */
export const GoogleButton: React.FC<{ successMessage: string; errorFallback: string; dividerLabel?: string }> = ({
  successMessage,
  errorFallback,
  dividerLabel = 'o continúa con',
}) => {
  const { googleLogin } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const onPress = async () => {
    setLoading(true);
    try {
      const idToken = await getGoogleIdToken();
      if (!idToken) return; // el usuario cerró el selector de cuentas
      await googleLogin(idToken);
      toast.success(successMessage);
    } catch (err) {
      const fromBackend = (err as { response?: unknown })?.response;
      toast.error(fromBackend ? errorMessage(err, errorFallback) : err instanceof Error ? err.message : errorFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Pressable
        onPress={onPress}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Continuar con Google"
        style={({ pressed }) => [styles.btn, pressed && { backgroundColor: '#1a2337' }, loading && { opacity: 0.6 }]}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <>
            <GoogleLogo />
            <Text style={styles.text}>Continuar con Google</Text>
          </>
        )}
      </Pressable>
      <Divider label={dividerLabel} style={{ marginVertical: spacing.xl }} />
    </View>
  );
};

/** "G" de Google, sin depender de imágenes. */
const GoogleLogo = () => (
  <View style={styles.logo}>
    <Text style={styles.logoText}>
      <Text style={{ color: '#4285F4' }}>G</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  btn: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#131314', // estilo "filled_black" del botón de Google en el web
  },
  text: { color: colors.text, fontFamily: fonts.medium, fontSize: 15 },
  logo: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 18 },
});
