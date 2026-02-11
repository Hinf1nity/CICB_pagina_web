import { Stack } from 'expo-router';
import "../../global.css";
import { useFonts } from 'expo-font';
import { 
  PublicSans_400Regular, 
  PublicSans_600SemiBold, 
  PublicSans_700Bold, 
  PublicSans_800ExtraBold 
} from '@expo-google-fonts/public-sans';
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';

// --- IMPORTACIONES DE NAVEGACIÓN Y TEMA ---
import { useColorScheme } from 'react-native'; 
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';

// --- IMPORTACIONES DE TANSTACK QUERY ---
import { AppState, AppStateStatus, Platform } from 'react-native';
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

// 1. Inicializar el cliente
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, 
    },
  },
});

// 2. Configurar el Manager de Conexión
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  // Detectar el tema del sistema (oscuro o claro)
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    PublicSans_400Regular,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
    PublicSans_800ExtraBold,
  });

  // 3. Configurar el Manager de Foco
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {/* Agregamos ThemeProvider aquí. 
          Si colorScheme es 'dark', usa DarkTheme (fondo oscuro, textos claros por defecto).
          Si no, usa DefaultTheme (blanco).
      */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="calculator" options={{ headerShown: false }} />
          <Stack.Screen name="summary" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}