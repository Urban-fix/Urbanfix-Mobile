import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '../../components/AppText';
import { Link } from 'expo-router';
import { AuthLayout } from '../../components/AuthLayout';
import { GoogleButton } from '../../components/GoogleButton';
import { Body, Button, Input, LinkText } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { errorMessage } from '../../api/client';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Field = 'nombre' | 'apellido' | 'email' | 'password' | 'confirmPassword';

const PASSWORD_RULES = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Al menos una mayúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Al menos una minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Al menos un número', test: (p: string) => /\d/.test(p) },
];

/** Lista de requisitos que se van marcando mientras se escribe (como PasswordRequirements del web). */
const PasswordRequirements: React.FC<{ password: string }> = ({ password }) => (
  <View style={{ gap: 4, marginTop: -4 }}>
    {PASSWORD_RULES.map((r) => {
      const ok = r.test(password);
      return (
        <View key={r.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Feather name={ok ? 'check-circle' : 'circle'} size={13} color={ok ? colors.accent : colors.textMuted} />
          <Body size={12} style={{ color: ok ? colors.accent : colors.textMuted }}>
            {r.label}
          </Body>
        </View>
      );
    })}
  </View>
);

export default function RegisterScreen() {
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState<Record<Field, string>>({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: Field) => (t: string) => setForm((f) => ({ ...f, [k]: t }));

  const onSubmit = async () => {
    const e: typeof errors = {};
    // Mismas reglas que el backend (RegisterRequestDTO / PasswordConstraints) y el frontend web
    const email = form.email.trim();
    if (!form.nombre.trim()) e.nombre = 'Nombre es requerido';
    else if (form.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres';
    if (!form.apellido.trim()) e.apellido = 'Apellido es requerido';
    else if (form.apellido.trim().length < 2) e.apellido = 'Mínimo 2 caracteres';
    if (!email) e.email = 'Email es requerido';
    else if (!EMAIL_RE.test(email)) e.email = 'Email inválido';
    if (!form.password) e.password = 'Contraseña es requerida';
    else if (!PASSWORD_RULES.every((r) => r.test(form.password))) e.password = 'La contraseña no cumple los requisitos';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      await register({ nombre: form.nombre.trim(), apellido: form.apellido.trim(), email, password: form.password, rol: 'CIUDADANO' });
      toast.success('Registro exitoso');
    } catch (err) {
      toast.error(errorMessage(err, 'Error al registrar'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Crea Tu Cuenta" subtitle="Únete a UrbanFix para reportar problemas urbanos" compactVisual>
      <GoogleButton successMessage="Registro con Google exitoso" errorFallback="Error al registrarse con Google" dividerLabel="o regístrate con" />
      <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Input label="Nombre" value={form.nombre} onChangeText={set('nombre')} error={errors.nombre} autoComplete="given-name" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Apellido" value={form.apellido} onChangeText={set('apellido')} error={errors.apellido} autoComplete="family-name" />
          </View>
        </View>
        <Input label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
        <Input label="Contraseña" value={form.password} onChangeText={set('password')} secureTextEntry error={errors.password} />
        <PasswordRequirements password={form.password} />
        <Input label="Confirmar contraseña" value={form.confirmPassword} onChangeText={set('confirmPassword')} secureTextEntry error={errors.confirmPassword} />
      </View>

      <Button title={loading ? 'Registrando...' : 'Registrarse'} onPress={onSubmit} isLoading={loading} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl }}>
        <Text>
          <Body muted size={14}>
            ¿Ya tienes cuenta?{' '}
          </Body>
          <Link href="/login">
            <LinkText>Inicia sesión</LinkText>
          </Link>
        </Text>
      </View>
    </AuthLayout>
  );
}
