import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ListItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
}

export const ListItem = ({ icon, title, subtitle }: ListItemProps) => {
  return (
    <Pressable className="flex-row items-center justify-between p-4 bg-white dark:bg-background-dark border border-gray-100 dark:border-gray-800 rounded-xl mb-3 active:bg-gray-50 dark:active:bg-gray-800">
      <View className="flex-row items-center gap-4">
        <View className="bg-primary/10 p-3 rounded-lg">
          <MaterialIcons name={icon} size={24} color="#0f3e33" />
        </View>
        <View>
          <Text className="text-primary dark:text-white font-bold text-base">
            {title}
          </Text>
          <Text className="text-gray-500 text-xs">
            {subtitle}
          </Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
    </Pressable>
  );
};