import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DetailRowItem } from './DetailRowItem';
import { Category } from '../data/detailData'; // Ajusta la ruta

interface AccordionProps {
  data: Category;
  isNested?: boolean; // Para cambiar estilos si es un acordeón hijo
}

export const Accordion = ({ data, isNested = false }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(data.isOpen || false);

  // Estilos dinámicos según si es padre o hijo (anidado)
  const containerStyle = isNested
    ? "bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 mb-2"
    : `bg-white dark:bg-card-dark rounded-xl border overflow-hidden shadow-sm mb-3 ${
        isOpen ? 'border-secondary/30 dark:border-secondary/40' : 'border-gray-100 dark:border-white/10'
      }`;

  const headerBg = isOpen && !isNested ? 'bg-secondary/5 dark:bg-secondary/10' : '';
  const iconColor = isNested ? '#00bfa5' : (isOpen ? '#00bfa5' : '#0f3e33'); // Secondary vs Primary
  const iconBg = isNested ? '' : (isOpen ? 'bg-secondary text-white' : 'bg-primary/5 text-primary');

  return (
    <View className={containerStyle}>
      <Pressable 
        onPress={() => setIsOpen(!isOpen)}
        className={`flex-row items-center justify-between p-4 ${headerBg}`}
      >
        <View className="flex-row items-center gap-3">
          {/* Icono (Solo si no es anidado o si quieres icono en hijos tambien) */}
          <View className={`items-center justify-center ${isNested ? '' : 'size-10 rounded-lg'} ${iconBg}`}>
            <MaterialIcons 
              name={data.icon} 
              size={isNested ? 20 : 24} 
              color={isNested ? '#00bfa5' : (isOpen ? 'white' : (process.env.EXPO_PUBLIC_THEME === 'dark' ? '#34d399' : '#0f3e33'))} 
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
        
        <MaterialIcons 
          name="expand-more" 
          size={24} 
          color="#9ca3af" 
          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {/* Contenido Desplegable */}
      {isOpen && (
        <View className={`px-4 pb-4 ${isNested ? 'pt-0' : ''}`}>
          
          {/* Renderizar Filas Simples */}
          {data.items?.map((item, index) => (
            <DetailRowItem key={index} {...item} />
          ))}

          {/* Renderizar Subcategorías (Acordeones anidados) */}
          {data.subCategories?.map((subCat) => (
            <Accordion key={subCat.id} data={subCat} isNested={true} />
          ))}
        </View>
      )}
    </View>
  );
};