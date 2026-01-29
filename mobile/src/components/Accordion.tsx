import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DetailRowItem } from './DetailRowItem';

export interface DetailRow {
  label: string;
  subLabel?: string;
  price: string;
}

export interface Category {
  id: string;
  title: string;
  items?: DetailRow[];
  subCategories?: Category[]; // Para acordeones anidados
  isOpen?: boolean; // Estado inicial
}

interface AccordionProps {
  data: Category;
  isNested?: boolean;
}

export const Accordion = ({ data, isNested = false }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(data.isOpen || false);

  // Configuración del punto verde pastel
  const dotColor = "#b2f2bb"; // Verde claro pastel (puedes usar #d1fae5 para uno más sutil)

  const containerStyle = isNested
    ? "bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 mb-2"
    : `bg-white dark:bg-card-dark rounded-xl border overflow-hidden shadow-sm mb-3 ${
        isOpen ? 'border-secondary/30 dark:border-secondary/40' : 'border-gray-100 dark:border-white/10'
      }`;

  const headerBg = isOpen && !isNested ? 'bg-secondary/5 dark:bg-secondary/10' : '';

  return (
    <View className={containerStyle}>
      <Pressable 
        onPress={() => setIsOpen(!isOpen)}
        className={`flex-row items-center justify-between p-4 ${headerBg}`}
      >
        <View className="flex-row items-center gap-3">
          
          {/* SUSTITUCIÓN: Icono por Punto Verde Pastel */}
          <View className="items-center justify-center">
            <View 
              style={{ 
                width: isNested ? 8 : 12, 
                height: isNested ? 8 : 12, 
                borderRadius: 6, 
                backgroundColor: dotColor 
              }} 
            />
          </View>
          
          <Text className={`text-sm font-bold uppercase ${
            isNested 
              ? 'text-gray-700 dark:text-gray-200 tracking-tight' 
              : (isOpen ? 'text-primary dark:text-secondary' : 'text-[#121716] dark:text-gray-100')
          }`}>
            {data.title}
          </Text>
        </View>
        
        {/* Mantenemos la flecha de expansión para indicar interactividad */}
        <MaterialIcons 
          name="expand-more" 
          size={24} 
          color="#9ca3af" 
          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {isOpen && (
        <View className={`px-4 pb-4 ${isNested ? 'pt-0' : ''}`}>
          {data.items?.map((item, index) => (
            <DetailRowItem key={index} {...item} />
          ))}

          {data.subCategories?.map((subCat) => (
            <Accordion key={subCat.id} data={subCat} isNested={true} />
          ))}
        </View>
      )}
    </View>
  );
};