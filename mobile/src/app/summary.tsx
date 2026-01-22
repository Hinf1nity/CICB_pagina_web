import React from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';

// Importamos componentes
import { StatCard } from '../components/StatCard';
import { Accordion } from '../components/Accordion';
import { CATEGORIES } from '../data/detailData';

export default function SummaryDetailScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* --- HEADER SUPERIOR (STICKY) --- */}
      <SafeAreaView edges={['top']} className="bg-primary shadow-md z-50">
        <View className="px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Pressable 
              onPress={() => router.back()}
              className="size-10 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"
            >
              <MaterialIcons name="arrow-back-ios" size={20} color="white" />
            </Pressable>
            <View>
              <Text className="text-white text-lg font-bold leading-tight">
                Detalle de Aranceles
              </Text>
              <Text className="text-white/80 text-[10px] uppercase tracking-widest">
                Colegio de Ingenieros Civiles
              </Text>
            </View>
          </View>
          <Pressable className="size-10 items-center justify-center rounded-lg active:bg-white/10">
            <MaterialIcons name="share" size={22} color="white" />
          </Pressable>
        </View>
        
        {/* --- STATS DASHBOARD --- */}
        <View className="px-4 pb-8 pt-2">
          <View className="flex-row gap-2">
            <StatCard label="Arancel Mensual" value="12.450" currency="BOB" />
            <StatCard label="Arancel Diario" value="565" currency="BOB" />
            <StatCard label="Arancel Por Hora" value="72" currency="BOB" />
          </View>
        </View>
      </SafeAreaView>

      {/* --- CONTENIDO SCROLLEABLE --- */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }} // Espacio para el footer
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- BARRA DE BÚSQUEDA (Con margen negativo para superponerse) --- */}
        <View className="px-4 -mt-6 mb-6">
          <View className="flex-row items-center bg-white dark:bg-card-dark h-12 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 px-4">
            <MaterialIcons name="search" size={22} color="#9ca3af" />
            <TextInput 
              placeholder="Filtrar categorías o tareas..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-3 text-base text-gray-800 dark:text-white h-full"
            />
          </View>
        </View>

        {/* --- TÍTULO DE SECCIÓN --- */}
        <View className="px-4 mb-3 flex-row items-center justify-between">
          <Text className="text-primary dark:text-secondary text-xs font-bold uppercase tracking-widest">
            Desglose por Especialidad
          </Text>
          <Text className="text-[10px] text-gray-400 font-medium">
            Gestión 2024
          </Text>
        </View>

        {/* --- LISTA DE ACORDEONES --- */}
        <View className="px-4 gap-3">
          {CATEGORIES.map((category) => (
            <Accordion key={category.id} data={category} />
          ))}
        </View>

      </ScrollView>

    </View>
  );
}