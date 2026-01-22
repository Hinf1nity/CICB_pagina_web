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

// Previene que el splash screen se oculte antes de cargar fuentes
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    PublicSans_400Regular,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
    PublicSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    // Stack es el equivalente nativo a <Routes>
    <Stack>
      {/* Definimos que la pantalla principal (index) no tenga header por defecto */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="calculator" options={{ headerShown: false }} />
      <Stack.Screen name="summary" options={{ headerShown: false }} />
      {/* Cualquier otra configuración global va aquí */}
    </Stack>
  );
}