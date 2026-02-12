import React from 'react';
import { View, Text, Image, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';

const DEPARTMENTS = [
  { name: 'Bolivia', image: require('../../assets/LOGO CIC B sin fondo.png'), active: false },
  { name: 'La Paz', image: require('../../assets/cicLaPaz.png'), active: false },
  { name: 'Santa Cruz', image: require('../../assets/cicSantaCruz.png'), active: false },
  { name: 'Cochabamba', image: require('../../assets/cicCochabamba.png'), active: false },
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
    // CAMBIO 1: Fondo base dinámico coordinado (Plomo oscuro en dark mode)
    <View className="flex-1 bg-[#f8faf9] dark:bg-zinc-950"> 
      <Stack.Screen options={{ headerShown: false }} />

      {/* --- BACKGROUND --- */}
      <View className="absolute top-0 left-0 w-full z-0" style={{ height: height * 1.1 }}>
        <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop' }} 
            className="w-full h-full"
            resizeMode="cover"
        />
        <LinearGradient
            colors={['rgba(15, 61, 51, 0.95)', 'rgba(15, 61, 51, 0.8)', 'transparent']}
            className="absolute top-0 left-0 w-full h-full"
            locations={[0, 0.5, 1]}
        />
      </View>

      <SafeAreaView className="flex-1 relative z-10">
        <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }} 
            showsVerticalScrollIndicator={false}
            // CAMBIO 2: Esto elimina el bloque negro al final asegurando que el fondo sea uniforme
            className="bg-transparent" 
        >
            
            <View className="pt-6 px-3 pb-2">
                <Text className="text-white text-xl font-extrabold tracking-[0.2em] text-center mb-8 drop-shadow-md">
                    CICB BOLIVIA
                </Text>

                <View className="flex-row flex-wrap justify-center gap-y-6">
                    {DEPARTMENTS.map((dept, index) => (
                        <View key={index} className="w-[25%] items-center justify-center">
                            <View className="items-center justify-center mb-5">
                                <Image
                                    source={dept.image}
                                    className={`w-11 h-11 mb-1 ${dept.active ? 'opacity-100' : 'opacity-80'}`}
                                    resizeMode="contain"
                                />
                                <Text className="text-[9px] font-semibold uppercase text-center text-white/90 leading-tight">
                                    {dept.name}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* --- TARJETA CENTRAL (Ahora en Plomo/Gris) --- */}
            <View className="px-6 mt-2">
                {/* CAMBIO 3: 'bg-slate-50' para claro y 'bg-zinc-800' para el plomo que pediste */}
                <View className="bg-slate-50 dark:bg-zinc-800 p-8 rounded-[40px] shadow-2xl border border-white/40 dark:border-zinc-700">
                    <View className="items-center">
                        <View className="size-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl items-center justify-center mb-6">
                            <MaterialIcons name="calculate" size={36} color="#1a5d4d" />
                        </View>

                        <Text className="text-[#0f3e33] dark:text-gray-100 text-2xl font-bold leading-tight text-center mb-4">
                            Calculadora de Honorarios Profesionales
                        </Text>

                        <Text className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center max-w-xs mb-8">
                            Determine sus aranceles de forma oficial según los parámetros de antigüedad, ubicación y tipo de actividad técnica.
                        </Text>

                        <Pressable 
                            onPress={() => navigation.navigate('calculator')}
                            // CAMBIO 4: Botón con un verde más brillante para que resalte sobre el plomo
                            className="w-full bg-[#1a5d4d] active:bg-[#0f3e33] flex-row items-center justify-center gap-3 py-5 rounded-2xl shadow-lg"
                        >
                            <MaterialIcons name="rocket-launch" size={20} color="white" />
                            <Text className="text-white text-lg font-bold">Iniciar Cálculo</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* --- FOOTER (Integrado) --- */}
            {/* CAMBIO 5: Agregamos un fondo sutil o transparencia para evitar el bloque negro de la captura */}
            <View className="mt-auto py-5 px-6 items-center gap-2">
                <Text className="text-[11px] text-white uppercase tracking-[0.25em] font-extrabold text-center">
                    Colegio de Ingenieros Civiles de Bolivia
                </Text>
                <Text className="text-[10px] text-white font-bold">
                    Gestión Institucional 2024-2026
                </Text>
            </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}