import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Componentes modulares
import { FormInput } from '../components/forms/FormInput';
import { FormSelect, SelectOption } from '../components/forms/FormSelect';
import { LocationToggle } from '../components/forms/LocationToggle';

const DEPARTAMENTOS: SelectOption[] = [
  { label: 'La Paz', value: 'LP' },
  { label: 'Santa Cruz', value: 'SC' },
  { label: 'Cochabamba', value: 'CB' },
  { label: 'Oruro', value: 'OR' },
  { label: 'Potosí', value: 'PT' },
  { label: 'Tarija', value: 'TJ' },
  { label: 'Chuquisaca', value: 'CH' },
  { label: 'Beni', value: 'BN' },
  { label: 'Pando', value: 'PN' },
];

const GRADOS: SelectOption[] = [
  { label: 'Licenciatura', value: 'lic' },
  { label: 'Especialidad', value: 'esp' },
  { label: 'Maestría', value: 'mae' },
  { label: 'Doctorado', value: 'doc' },
];

const ACTIVIDADES: SelectOption[] = [
    { label: 'Diseño', value: 'diseno' },
    { label: 'Supervisión', value: 'supervision' },
    { label: 'Avalúo', value: 'avaluo' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  // Estado básico para el ejemplo
  // --- ESTADOS DEL FORMULARIO ---
  const [antiguedad, setAntiguedad] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [grado, setGrado] = useState('');
  const [location, setLocation] = useState<'ciudad' | 'campo'>('ciudad');
  const [actividad, setActividad] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header Personalizado */}
      <View className="flex-row items-center bg-white dark:bg-card-dark p-4 border-b border-border-light dark:border-border-dark sticky top-0 z-10">
        <Pressable className="size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800"
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#0f3e33" />
        </Pressable>
        <View className="flex-1 px-2">
          <Text className="text-center text-lg font-bold leading-tight text-primary dark:text-white">
            Formulario de Cálculo
          </Text>
          <Text className="text-center text-[10px] uppercase tracking-widest text-accent font-semibold mt-0.5">
            CICB Bolivia
          </Text>
        </View>
        <Pressable className="size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800">
          <MaterialIcons name="info-outline" size={24} color="#0f3e33" />
        </Pressable>
      </View>

      {/* Main Form Content */}
      <View className="flex-1 relative">
          <ScrollView 
            className="flex-1 p-4" 
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            
            {/* Sección: Info Profesional */}
            <View className="mb-6">
              <View className="flex-row items-center gap-2 px-1 pb-4">
                <MaterialIcons name="engineering" size={24} color="#3c8d50" />
                <Text className="text-lg font-bold text-primary dark:text-white">
                  Información Profesional
                </Text>
              </View>

              <FormInput 
                label="Años de Antigüedad" 
                placeholder="Ej. 10" 
                keyboardType="numeric"
                suffix="años"
                value={antiguedad}
                onChangeText={setAntiguedad}
              />

              {/* Select DEPARTAMENTO */}
              <FormSelect 
                label="Departamento" 
                placeholder="Seleccione un departamento"
                value={departamento}
                onChange={setDepartamento}
                options={DEPARTAMENTOS}
              />

              {/* Select GRADO */}
              <FormSelect 
                label="Grado de Formación" 
                placeholder="Seleccione su grado"
                value={grado}
                onChange={setGrado}
                options={GRADOS}
              />
            </View>

            {/* Sección: Detalles de Actividad */}
            <View className="mb-6 pt-2 border-t border-gray-100 dark:border-gray-800">
              <View className="flex-row items-center gap-2 px-1 pb-4 pt-4">
                <MaterialIcons name="location-city" size={24} color="#3c8d50" />
                <Text className="text-lg font-bold text-primary dark:text-white">
                  Detalles de la Actividad
                </Text>
              </View>

              <LocationToggle 
                value={location} 
                onChange={setLocation} 
              />

              {/* Select ACTIVIDAD */}
              <FormSelect 
                label="Tipo de Actividad" 
                placeholder="Seleccione el servicio"
                value={actividad}
                onChange={setActividad}
                options={ACTIVIDADES}
              />
            </View>

            {/* Info Alert Box */}
            <View className="flex-row gap-3 rounded-xl bg-primary/5 dark:bg-primary/20 p-4 border border-primary/10">
              <MaterialIcons name="verified-user" size={20} color="#0f3e33" />
              <Text className="flex-1 text-sm leading-relaxed text-primary/80 dark:text-white/80">
                Los Aranceles Profesionales se fundamentan en la Ley N° 1449 por lo tanto, son de cumplimiento obligatorio para la población en general y para todos los profesionales <Text className="font-bold">Ingenieros Civiles de Bolivia.</Text>
              </Text>
            </View>

          </ScrollView>

        {/* Fixed Bottom Action Bar */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-card-dark/90 border-t border-border-light dark:border-border-dark">
          <Pressable 
            onPress={() => navigation.navigate('summary' as never)}
            className="flex-row w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 shadow-lg active:scale-[0.98] active:opacity-90"
          >
            <MaterialIcons name="calculate" size={24} color="white" />
            <Text className="text-base font-bold text-white">
              Calcular Honorarios
            </Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}