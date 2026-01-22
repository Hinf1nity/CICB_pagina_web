import React from 'react';
import { View, Text } from 'react-native';

interface StatCardProps {
  label: string;
  value: string;
  currency: string;
}

export const StatCard = ({ label, value, currency }: StatCardProps) => (
  <View className="bg-white/10 rounded-xl p-3 border border-white/10 flex-1">
    <Text className="text-[10px] text-white/70 uppercase font-bold mb-1">
      {label}
    </Text>
    <View className="flex-row items-baseline gap-1">
      <Text className="text-white text-lg font-bold">{value}</Text>
      <Text className="text-[10px] text-white/60">{currency}</Text>
    </View>
  </View>
);