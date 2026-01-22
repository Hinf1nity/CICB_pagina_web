import React from 'react';
import { View, Text } from 'react-native';

interface DetailRowItemProps {
  label: string;
  subLabel?: string;
  price: string;
}

export const DetailRowItem = ({ label, subLabel, price }: DetailRowItemProps) => (
  <View className="flex-row justify-between items-center py-2 border-t border-gray-100 dark:border-white/10">
    <View className="flex-col">
      <Text className="text-sm text-gray-600 dark:text-gray-300">{label}</Text>
      {subLabel && (
        <Text className="text-[10px] text-gray-400">{subLabel}</Text>
      )}
    </View>
    <Text className="text-sm font-bold text-primary dark:text-secondary">
      {price}
    </Text>
  </View>
);