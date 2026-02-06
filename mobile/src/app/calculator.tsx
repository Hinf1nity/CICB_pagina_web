import React, { useState } from 'react'; 
//Importamos el UseEffect (comentario original), adicion de ActivityIndicator a los imports para evitar errores, usaremos useQuery para los gets
import { View, Text, ScrollView, Pressable, StatusBar, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'; 
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../lib/api';
// Importamos useQuery de TanStack Query
import { useQuery } from '@tanstack/react-query';

// Componentes modulares
import { FormInput } from '../components/forms/FormInput';
import { FormSelect, SelectOption } from '../components/forms/FormSelect';
import { LocationToggle } from '../components/forms/LocationToggle';


const DEPARTAMENTOS: SelectOption[] = [
  { label: 'La Paz', value: 'La Paz' },
  { label: 'Santa Cruz', value: 'Santa Cruz' },
  { label: 'Cochabamba', value: 'Cochabamba' },
  { label: 'Oruro', value: 'Oruro' },
  { label: 'Potosí', value: 'Potosí' },
  { label: 'Tarija', value: 'Tarija' },
  { label: 'Chuquisaca', value: 'Chuquisaca' },
  { label: 'Beni', value: 'Beni' },
  { label: 'Pando', value: 'Pando' },
];

export default function HomeScreen() {
  const router = useRouter();

  const [antiguedad, setAntiguedad] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [grado, setGrado] = useState('');
  const [location, setLocation] = useState<'ciudad' | 'campo'>('ciudad');
  const [actividad, setActividad] = useState('');
  const insets = useSafeAreaInsets(); //Identificacion del area de los botones

  // --- NUEVA LÓGICA CON USEQUERY ---
  // Reemplazamos el useEffect por useQuery para gestionar los datos del backend
  const { data: options, isLoading } = useQuery({
    queryKey: ['arancelesOptions'],
    queryFn: async () => {
      // Realizamos el GET a la ruta correspondiente
      const response: any = await api.get('aranceles/aranceles/').json();
      
      // DIAGNÓSTICO PARA VERIFICAR EN TERMINAL
      console.log("DATOS REALES DEL BACKEND:", response);

      // Transformamos los strings del backend al formato como se usa el select (Lógica original)
      // Usamos los nombres exactos confirmados en la captura de pantalla del navegador
      const mappedGrados = (response.formaciones || []).map((f: string) => ({
        label: f,
        value: f
      }));

      const mappedActividades = (response.actividades || []).map((a: string) => ({
        label: a.split(',')[0], // Usamos la primera palabra para evitar la extension
        value: a
      }));

      return {
        grados: mappedGrados,
        actividades: mappedActividades
      };
    },
    // Configuración para que NO cargue a cada rato (Exigencia del jefe):
    staleTime: 1000 * 60 * 10, // Los datos se consideran "nuevos" por 10 minutos
    gcTime: 1000 * 60 * 30,    // Mantener en memoria por 30 minutos
  });

  //Alertas para el espacio no llenado 
  const handleCalculate = async () => {
    if (
      !antiguedad ||
      !departamento ||
      !grado ||
      !actividad
    ) {
      Alert.alert( 'Campos incompletos', 'Uno o más campos están vacíos. Por favor complételos.', [{ text: 'Entendido' }]);
      return;
    }

    const antiguedadNumber = Number(antiguedad);

    if (isNaN(antiguedadNumber) || antiguedadNumber <= 0) {
      Alert.alert( 'Dato inválido', 'La antigüedad debe ser un número válido mayor a 0.', [{ text: 'Entendido' }]);
      return;
    }
    
    try {
      const payload = {
        antiguedad: antiguedadNumber,
        departamento,
        formacion: grado,
        ubicacion: location,
        actividad,
      };

      const response = await api
        .post('aranceles/aranceles/', { json: payload })
        .json();

      router.push({
        pathname: '/summary',
        params: {
          result: JSON.stringify(response),
        },
      });
    } catch (error) {
      console.error('Error al calcular aranceles:', error);
      Alert.alert( 'Error', 'Ocurrió un error al calcular los aranceles. Intente nuevamente.', [{ text: 'Aceptar' }]);
    }
  };

  return (
    //Con esto tal vez se pueda arreglar el borde de la pantalla SafeAreaView, adicion del avoidungView para la modificacion del boton
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={['top']}>
      {/*Mejora e la visibilidad del boton */}
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" /> 
      
      <View className="flex-1">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header Personalizado */}
          <View className="flex-row items-center bg-white dark:bg-card-dark p-4 border-b border-border-light dark:border-border-dark">
            <Pressable
              className="size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800"
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back-ios" size={20} color="#0f3e33" />
            </Pressable>
            <View className="flex-1 px-2">
              <Text className="text-center text-lg font-bold leading-tight text-primary dark:text-white uppercase">Formulario de Cálculo</Text>
              <Text className="text-center text-[10px] uppercase tracking-widest text-accent font-semibold mt-0.5">CICB Bolivia</Text>
            </View>
          </View>

          {/* Main Form Content */}
          <ScrollView
            className="flex-1 p-4"
            contentContainerStyle={{ paddingBottom: 40 }} //CONTENIDO ADAPTABLE 
            showsVerticalScrollIndicator={false}
          >
            {/* Indicador de carga de espera para el GET*/}
            {isLoading ? (
              <View className="py-20">
                <ActivityIndicator size="large" color="#3c8d50"/>
                <Text className="text-center mt-4 text-gray-500">Cargando opciones...</Text>
              </View>
            ) : (
              <>
            {/* Sección: Info Profesional */}
            <View className="mb-2">
              <View className="flex-row items-center gap-2 px-1 pb-4">
                <MaterialIcons name="engineering" size={24} color="#3c8d50" />
                <Text className="text-lg font-bold text-primary dark:text-white">Información Profesional</Text>
              </View>
              <FormInput
                label="Años de Antigüedad"
                placeholder="Ej. 10"
                keyboardType="numeric"
                suffix="años"
                value={antiguedad}
                onChangeText={(text) => {   //Evitar que los anos tengan mas de dos digitos
                  const numericText = text.replace(/[^0-9]/g, '');
                  if (numericText.length <= 2) setAntiguedad(numericText);
                }}
              />
              {/* Select DEPARTAMENTO */}
              <FormSelect label="Departamento" placeholder="Seleccione un departamento" value={departamento} onChange={setDepartamento} options={DEPARTAMENTOS} />
              
              {/* Uso de gradosOptions que ahora vienen de useQuery (Corregido mapeo de datos) */}
              <FormSelect 
                label="Grado de Formación" 
                placeholder="Seleccione su grado" 
                value={grado} 
                onChange={setGrado} 
                options={options?.grados ?? []} 
              />
            </View>

            {/* Sección: Detalles de Actividad */}
            <View className="mb-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <View className="flex-row items-center gap-2 px-1 pb-4 pt-2">
                <MaterialIcons name="location-city" size={24} color="#3c8d50" />
                <Text className="text-lg font-bold text-primary dark:text-white">Detalles de la Actividad</Text>
              </View>
              <LocationToggle value={location} onChange={setLocation} />
              
              {/* Uso de actividadesOptions que ahora vienen de useQuery (Corregido mapeo de datos) */}
              <FormSelect 
                label="Tipo de Actividad" 
                placeholder="Seleccione el servicio" 
                value={actividad} 
                onChange={setActividad} 
                options={options?.actividades ?? []} 
              />
            </View>

            {/* Info Alert Box */}
            <View className="flex-row gap-3 rounded-xl bg-primary/5 dark:bg-primary/20 p-4 border border-primary/10">
              <MaterialIcons name="verified-user" size={20} color="#0f3e33" />
              <Text className="flex-1 text-sm leading-relaxed text-primary/80 dark:text-white/80">
                Los Aranceles Profesionales se fundamentan en la Ley N° 1449 por lo tanto, son de cumplimiento obligatorio para la población en general y para todos los profesionales <Text className="font-bold">Ingenieros Civiles de Bolivia.</Text>
              </Text>
            </View>
            </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        <View 
          style={{ 
            // Deteccion de botones en la pantalla
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16, 
            paddingTop: 12 
          }} 
          className="px-4 bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark"
        >
          <Pressable
            onPress={handleCalculate}
            disabled={isLoading}
            className={`flex-row w-full items-center justify-center gap-2 rounded-xl py-4 shadow-lg active:scale-[0.98] active:opacity-90 ${isLoading ? 'bg-gray-400' : 'bg-primary'}`}
          >
            <MaterialIcons name="calculate" size={24} color="white" />
            <Text className="text-base font-bold text-white">Calcular Honorarios</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}