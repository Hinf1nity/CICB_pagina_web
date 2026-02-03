import React from 'react';
import { View, Text } from 'react-native';

interface DetailRowItemProps {
  label: string;
  subLabel?: string;
  price: string;
}

export const DetailRowItem = ({
  label,
  subLabel,
  price,
}: DetailRowItemProps) => (
  <View className="flex-row justify-between items-start py-3 border-t border-gray-100 dark:border-white/10">
    
    {/* Texto flex para que no empuje los precios */}
    <View className="flex-1 pr-4">
      <Text 
        className="text-sm text-gray-700 dark:text-gray-300 leading-5"
        numberOfLines={3} // Limitacion de lineas, se puede cambiar
      >
        {label}
      </Text>

      {subLabel && (
        <Text className="text-[10px] text-gray-400 mt-0.5">
          {subLabel}
        </Text>
      )}
    </View>

    {/* Contenerdor del precio para evitar que sea empujado */}
    <View className="items-end">
      <Text className="text-[13px] font-bold text-primary dark:text-secondary text-right">
        {price}
      </Text>
    </View>

  </View>
);