import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface Accordion2Item {
  title: string;
  description: string;
}

interface Accordion2Props {
  title: string;
  items: Accordion2Item[];
}

export const Accordion_1 = ({ title, items }: Accordion2Props) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    // bg-white para modo claro, bg-zinc-900 para que se vea como en tu captura de modo oscuro
    <View className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
      
      {/* HEADER PRINCIPAL */}
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center justify-between p-4"
      >
        <View className="flex-row items-center gap-3">
          <View className="w-3 h-3 rounded-full bg-green-300" />
          {/* Texto dinámico para el título del acordeón */}
          <Text className="text-sm font-bold uppercase text-[#0f3e33] dark:text-[#3c8d50]">
            {title}
          </Text>
        </View>

        <MaterialIcons
          name="expand-more"
          size={24}
          color="#9ca3af"
          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {/* CONTENIDO */}
      {isOpen && (
        <View className="px-4 pb-4 gap-4">
          {items.map((item, index) => (
            <View key={index} className="py-3">
              {/* Título de la tipología: Negro en claro, Blanco en oscuro */}
              <Text className="text-sm font-bold text-gray-800 dark:text-white mb-2">
                {item.title}
              </Text>
              <View className="border-b border-gray-200 dark:border-white/10 mb-2" />
              {/* Descripción: Gris oscuro en claro, Gris claro en oscuro */}
              <Text className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};