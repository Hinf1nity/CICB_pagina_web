import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  suffix?: string;
}

export const FormInput = ({ label, suffix, ...props }: FormInputProps) => {
  return (
    <View className="mb-4">
      <Text className="text-base font-medium px-1 mb-2 text-primary dark:text-white">
        {label}
      </Text>
      <View className="relative">
        <TextInput 
          className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark h-14 px-4 text-base text-primary dark:text-white focus:border-accent"
          placeholderTextColor="#67837d"
          {...props}
        />
        {suffix && (
          <Text className="absolute right-4 top-4 text-sm text-input-text">
            {suffix}
          </Text>
        )}
      </View>
    </View>
  );
};