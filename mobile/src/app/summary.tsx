import React from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

// Importamos componentes
import { StatCard } from '../components/StatCard';
import { Accordion } from '../components/Accordion';
import { Accordion_1 } from '../components/Accordion_1';
import { parseTrabajosToCategories } from '../data/detailData';

interface Elemento {
  detalle: string;
  valor: number;
  unidad: string;
}
interface Nivel {
  nombre: string;
  elementos: Elemento[];
}
interface Trabajo {
  nombre: string;
  niveles: Nivel[];
}
interface ArancelResponse {
  mensual: number;
  diario: number;
  hora: number;
  trabajos: Trabajo[];
}

export default function SummaryDetailScreen() {
  const router = useRouter();
  const { result } = useLocalSearchParams();
  
  // Parseo de datos dentro del componente
  const data = result ? (JSON.parse(result as string) as ArancelResponse) : null;
  const categories = data ? parseTrabajosToCategories(data.trabajos) : []; //render de datos parseados

  console.log(data);

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
              className="size-10 items-center justify-center rounded-full active:bg-white/20"
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
        <View className="px-4 pb-4 pt-2">
          <View className="flex-row gap-2">
            <StatCard
              label="Arancel Mensual"
              value={data?.mensual ? data.mensual.toFixed(2) : '0.00'}
              currency="BOB"
            />
            <StatCard
              label="Arancel por Dia"
              value={data?.diario ? data.diario.toFixed(2) : '0.00'}
              currency="BOB"
            />
            <StatCard
              label="Arancel Por Hora"
              value={data?.hora ? data.hora.toFixed(2) : '0.00'}
              currency="BOB"
            />
          </View>
        </View>

        {/* Caja de informacion sobre el IVA */}
        <View className="px-4 pt-1 pb-4">
          <View className="flex-row items-center bg-white/10 p-3 rounded-lg border border-white/20">
            <MaterialIcons name="info" size={18} color="white" />
            <Text className="ml-2 text-[11px] text-white/90 font-medium flex-1">
              Nota: Los montos expresados en estos recuadros{' '}
              <Text className="font-bold underline">
                No incluye el impuestos ni los honorarios del ingeniero civil.
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* --- CONTENIDO SCROLLEABLE --- */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20}} // Espacio para el footer
        showsVerticalScrollIndicator={false}
      >
        {/* --- BARRA DE BÚSQUEDA --- */}
        <View className="px-4 mt-3 mb-6">
          <View className="flex-row items-center bg-white dark:bg-card-dark h-12 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 px-4">
            <MaterialIcons name="search" size={22} color="#9ca3af" />
            <TextInput
              placeholder="Filtrar categorías o tareas..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-3 text-base text-gray-800 dark:text-white h-full"
            />
          </View>
        </View>

        {/* Acordeon de la tipologia de edificaciones */}
        <View className="px-4 mb-6">
          <Accordion_1
            title="TIPOLOGIA DE LAS EDIFICACIONES"
            items={[
              {
                title: 'BASICA',
                description:
                  'Igual o menor a 60m² de superficie construida / 1 nivel de altura de hasta 3.5m (sin subsuelo).',
              },
              {
                title: 'SIMPLE',
                description:
                  'Hasta 450m² de superficie construida / Hasta 3 niveles positivos, puede contar o no con niveles negativos en función a la topografía.',
              },
              {
                title: 'MEDIANA',
                description:
                  'Hasta 4 niveles positivos y niveles negativos en función a la topografía.',
              },
              {
                title: 'MEDIANAMENTE COMPLEJA',
                description:
                  'Mayor o igual a 5 niveles positivos y los niveles negativos en función a la topografía.',
              },
              {
                title: 'COMPLEJA',
                description:
                  'Mayor o igual a 5 niveles positivos y los niveles negativos en función a la topografía.',
              },
              {
                title: 'ESPECIALES',
                description: 'Cualquier superficie construida.',
              },
            ]}
          />
          <Text className="text-[9px] text-gray-400 mt-2 px-1 italic">
            Fuente: Norma Boliviana de Edificaciones R.M. 186.
          </Text>
        </View>

        {/* --- TÍTULO DE SECCIÓN --- */}
        <View className="px-4 mb-3 flex-row items-center justify-between">
          <Text className="text-primary dark:text-secondary text-xs font-bold uppercase tracking-widest">
            Desglose por Especialidad
          </Text>
          <Text className="text-[10px] text-gray-400 font-medium">Gestión 2024</Text>
        </View>

        {/* --- LISTA DE ACORDEONES --- */}
        <View className="px-4 gap-3">
          {categories.map((cat) => (
            <Accordion key={cat.id} data={cat} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}