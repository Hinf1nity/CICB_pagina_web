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
  const dotColor = "#b2f2bb"; 

  // RESTAURADO: Volvemos al zinc-900 (negro/oscuro) original para los acordeones
  const containerStyle = isNested
    ? "bg-gray-50 dark:bg-zinc-800/40 rounded-lg border border-gray-100 dark:border-white/5 mb-2"
    : `bg-white dark:bg-zinc-900 rounded-xl border overflow-hidden shadow-sm mb-3 ${
        isOpen ? 'border-secondary/30 dark:border-secondary/40' : 'border-gray-100 dark:border-white/10'
      }`;

  const headerBg = isOpen && !isNested ? 'bg-secondary/5 dark:bg-emerald-900/10' : '';

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
          
          {/* CAMBIO DINÁMICO: Letras que se adaptan al tema del sistema */}
          <Text className={`text-sm font-bold uppercase ${
            isNested 
              ? 'text-gray-700 dark:text-gray-200 tracking-tight' 
              : (isOpen ? 'text-[#0f3e33] dark:text-emerald-500' : 'text-[#121716] dark:text-white')
          }`}>
            {data.title}
          </Text>
        </View>
        
        <MaterialIcons 
          name="expand-more" 
          size={24} 
          color="#9ca3af" 
          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {isOpen && (
        <View className={`px-4 pb-4 ${isNested ? 'pt-0' : ''}`}>
          {/* IMPORTANTE: Para que los precios cambien de color, 
              debes aplicar la clase dinámica DENTRO de DetailRowItem.tsx 
          */}
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