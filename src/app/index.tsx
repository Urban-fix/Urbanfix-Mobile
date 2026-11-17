import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

/**
 * Ruta inicial "/": decide a dónde ir según la sesión.
 * Sin esto, al abrir la app sin sesión aparecía "Unmatched Route",
 * porque "/" solo existía dentro del grupo protegido (app).
 */
export default function Index() {
  const { isAuthenticated } = useAuth();
  return <Redirect href={isAuthenticated ? '/inicio' : '/login'} />;
}
