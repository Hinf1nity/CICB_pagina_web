import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LocationToggleProps {
  value: 'ciudad' | 'campo';
  onChange: (val: 'ciudad' | 'campo') => void;
}

export const LocationToggle = ({ value, onChange }: LocationToggleProps) => {
  return (
    <View className="mb-6">
      <Text className="text-base font-medium px-1 mb-2 text-primary dark:text-white">
        Ubicación del Proyecto
      </Text>
      <View className="flex-row w-full rounded-xl bg-border-light/30 dark:bg-border-dark p-1.5">
        {/* Opción Ciudad */}
        <Pressable 
          onPress={() => onChange('ciudad')}
          className={`flex-1 flex-row h-11 items-center justify-center rounded-lg transition-all ${
            value === 'ciudad' 
              ? 'bg-white dark:bg-primary' 
              : 'bg-transparent'
          }`}
        >
          <MaterialIcons 
            name="apartment" 
            size={20} 
            color={value === 'ciudad' ? (process.env.EXPO_PUBLIC_THEME === 'dark' ? 'white' : '#2d7a67ff') : '#67837d'} 
            style={{ marginRight: 8 }}
          />
          <Text className={`text-sm font-semibold ${value === 'ciudad' ? 'text-primary dark:text-white' : 'text-input-text'}`}>
            Ciudad
          </Text>
        </Pressable>

        {/* Opción Campo */}
        <Pressable 
          onPress={() => onChange('campo')}
          className={`flex-1 flex-row h-11 items-center justify-center rounded-lg transition-all ${
            value === 'campo' 
              ? 'bg-white dark:bg-primary'
              : 'bg-transparent'
          }`}
        >
          <MaterialIcons 
            name="landscape" 
            size={20} 
            color={value === 'campo' ? (process.env.EXPO_PUBLIC_THEME === 'dark' ? 'white' : '#2d7a67ff') : '#67837d'} 
            style={{ marginRight: 8 }}
          />
          <Text className={`text-sm font-semibold ${value === 'campo' ? 'text-primary dark:text-white' : 'text-input-text'}`}>
            Campo
          </Text>
        </Pressable>
      </View>
    </View>
  );
};