import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export const FormSelect = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  options 
}: FormSelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Encontrar etiqueta actual
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  const isDark = process.env.EXPO_PUBLIC_THEME === 'dark';

  // Renderizado de cada ítem de la lista
  const renderItem = ({ item }: { item: SelectOption }) => (
    <Pressable
      onPress={() => {
        onChange(item.value);
        setModalVisible(false);
      }}
      className={`p-4 border-b border-gray-100 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-800 flex-row items-center justify-between ${
        item.value === value ? 'bg-primary/5 dark:bg-primary/20' : ''
      }`}
    >
      <Text className={`text-base ${
        item.value === value 
          ? 'text-primary dark:text-accent font-bold' 
          : 'text-gray-600 dark:text-gray-300'
      }`}>
        {item.label}
      </Text>
      {item.value === value && (
        <MaterialIcons name="check" size={20} color={isDark ? '#00bfa5' : '#0f3e33'} />
      )}
    </Pressable>
  );

  return (
    <View className="mb-4">
      <Text className="text-base font-medium px-1 mb-2 text-primary dark:text-white">
        {label}
      </Text>
      
      {/* 1. EL BOTÓN DISPARADOR (Trigger) */}
      <Pressable 
        onPress={() => setModalVisible(true)}
        className="flex-row items-center justify-between w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark h-14 px-4 active:opacity-80"
      >
        <Text className={`text-base ${value ? 'text-primary dark:text-white' : 'text-input-text'}`}>
          {displayText}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#67837d" />
      </Pressable>

      {/* 2. EL MODAL (Overlay) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Botón físico atrás en Android
        statusBarTranslucent={true} // Cubrir toda la pantalla
      >
        {/* Fondo oscuro semitransparente */}
        <TouchableOpacity 
          className="flex-1 bg-black/60 justify-center items-center p-6"
          activeOpacity={1} 
          onPress={() => setModalVisible(false)} // Cerrar al tocar afuera
        >
          {/* Contenedor de la lista (Evitamos que el toque se propague al fondo) */}
          <Pressable 
            className="w-full bg-white dark:bg-card-dark rounded-xl overflow-hidden shadow-2xl max-h-[70%]"
            onPress={(e) => e.stopPropagation()} 
          >
            {/* Cabecera del Modal */}
            <View className="flex-row justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a2824]">
              <Text className="text-lg font-bold text-primary dark:text-white">
                {label}
              </Text>
              <Pressable onPress={() => setModalVisible(false)} className="p-1">
                <MaterialIcons name="close" size={24} color="#9ca3af" />
              </Pressable>
            </View>

            {/* Lista Optimizada */}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={renderItem}
              showsVerticalScrollIndicator={true}
            />
          </Pressable>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};