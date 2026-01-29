import React from 'react';
import { View, Text, Image, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';

// --- DATOS DEPARTAMENTOS ---
const DEPARTMENTS = [
  { name: 'Bolivia', image: require('../../assets/LOGO CIC B sin fondo.png'), active: false },
  { name: 'La Paz', image: require('../../assets/cicLaPaz.png'), active: false },
  { name: 'Santa Cruz', image: require('../../assets/cicSantaCruz.png'), active: false },
  { name: 'Cochabamba', image: require('../../assets/cicCochabamba.png'), active: false }, // agriculture no existe en MaterialIcons standard, cambiamos a similar
  { name: 'Oruro', image: require('../../assets/cicOruro.png'), active: false },
  { name: 'Potosí', image: require('../../assets/cicPotosi.png'), active: false },
  { name: 'Tarija', image: require('../../assets/cicTarija.png'), active: false },
  { name: 'Chuquisaca', image: require('../../assets/cicChuquisaca.png'), active: false },
  { name: 'Beni', image: require('../../assets/cicBeni.png'), active: false },
  { name: 'Pando', image: require('../../assets/cicPando.png'), active: false },
];

export default function MenuScreen() {
  const navigation = useRouter();
  const { height } = Dimensions.get('window');

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <Stack.Screen options={{ headerShown: false }} />

      {/* --- BACKGROUND CON DEGRADADO --- */}
      {/* Imagen de fondo (Ocupa 75% del alto como en tu CSS) */}
      <View className="absolute top-0 left-0 w-full z-0" style={{ height: height * 0.75 }}>
        <Image 
            // Usamos una imagen de construcción genérica de alta calidad
            source={{ uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop' }} 
            className="w-full h-full"
            resizeMode="cover"
        />
        {/* Capa de Gradiente sobre la imagen (hero-gradient) */}
        <LinearGradient
            // rgba(15, 61, 51, 0.9) -> rgba(15, 61, 51, 0.5) -> rgba(248, 250, 249, 1)
            colors={['rgba(15, 61, 51, 0.92)', 'rgba(15, 61, 51, 0.7)', '#f8faf9']}
            className="absolute top-0 left-0 w-full h-full"
            locations={[0, 0.6, 1]}
        />
      </View>

      <SafeAreaView className="flex-1 relative z-10">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            
            {/* --- HEADER --- */}
            <View className="pt-4 px-6 pb-2">
                <Text className="text-white text-xl font-extrabold tracking-[0.2em] text-center mb-8 drop-shadow-md">
                    CICB BOLIVIA
                </Text>

                {/* Grid de Departamentos */}
                <View className="flex-row flex-wrap justify-center gap-y-6">
                    {DEPARTMENTS.map((dept, index) => (
                        <View key={index} className="w-[25%] items-center justify-center">
                            <View className="w-10 h-10 items-center justify-center mb-1">
                                <MaterialIcons 
                                    // @ts-ignore: icon name dynamic
                                    name={dept.icon} 
                                    size={22} 
                                    color={dept.active ? '#0f3e33' : 'white'} 
                                    style={{ marginBottom: 4 }}
                                />
                                <Image
                                    source={dept.image}
                                    className={`w-9 h-9 mb-1 ${dept.active ? 'opacity-100' : 'opacity-80'}`}
                                    resizeMode="contain"
                                />
                                <Text numberOfLines={2} ellipsizeMode="tail" className="text-[9px] font-semibold uppercase text-center text-white/90 leading-tight">
                                    {dept.name}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* --- TARJETA CENTRAL (Glassmorphism) --- */}
            <View className="px-6 mt-8">
                {/* Contenedor simulando el blur y borde blanco */}
                <View className="bg-white/95 dark:bg-zinc-900/95 p-8 rounded-[40px] shadow-2xl shadow-primary/30 border border-white/40 dark:border-zinc-800">
                    <View className="items-center">
                        {/* Icono Principal */}
                        <View className="size-16 bg-secondary/10 rounded-2xl items-center justify-center mb-6">
                            <MaterialIcons name="calculate" size={36} color="#0f3e33" />
                        </View>

                        {/* Título */}
                        <Text className="text-primary dark:text-white text-2xl font-bold leading-tight text-center mb-4">
                            Calculadora de Honorarios Profesionales
                        </Text>

                        {/* Descripción */}
                        <Text className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center max-w-xs mb-8">
                            Determine sus aranceles de forma oficial según los parámetros de antigüedad, ubicación y tipo de actividad técnica.
                        </Text>

                        {/* Botón de Acción */}
                        <Pressable 
                            onPress={() => navigation.navigate('calculator')} // <-- Redirige a tu formulario (asumiendo que es /index)
                            className="w-full bg-secondary active:bg-primary flex-row items-center justify-center gap-3 py-5 rounded-2xl shadow-lg shadow-secondary/25 active:scale-[0.98]"
                        >
                            <MaterialIcons name="rocket-launch" size={20} color="white" />
                            <Text className="text-white text-lg font-bold">Iniciar Cálculo</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* --- FOOTER --- */}
            <View className="mt-auto py-10 px-6 items-center gap-2">
                <View className="h-1 w-12 bg-secondary/20 rounded-full mb-4" />
                <Text className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-[0.25em] font-extrabold text-center">
                    Colegio de Ingenieros Civiles de Bolivia
                </Text>
                <Text className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                    Gestión Institucional 2024-2025
                </Text>
            </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}