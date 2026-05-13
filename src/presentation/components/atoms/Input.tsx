import React, { useState } from 'react';
import { TextInput, View, Text, TextInputProps, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onPressIconRight?: () => void;
  className?: string;
  themeOverride?: 'light' | 'dark';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  iconLeft,
  iconRight,
  onPressIconRight,
  className = '',
  style,
  themeOverride,
  ...props
}) => {
  const { theme } = useThemeStore();
  const isDark = themeOverride ? themeOverride === 'dark' : theme === 'dark';
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`w-full mb-5 ${className}`}>
      {label && (
        <Text className={`text-xs font-semibold uppercase tracking-wider mb-2
          ${isDark ? 'text-brand-darkSubtext' : 'text-brand-lightSubtext'}
        `}>
          {label}
        </Text>
      )}
      
      <View
        className={`flex-row items-center rounded-2xl border-2 px-4 py-3 bg-transparent transition-all
          ${isFocused ? 'border-brand-primary' : error ? 'border-brand-danger' : isDark ? 'border-brand-darkSurface bg-brand-darkSurface' : 'border-slate-200 bg-white'}
        `}
      >
        {iconLeft && <View className="mr-3">{iconLeft}</View>}
        
        <TextInput
          className={`flex-1 text-base font-normal h-6 p-0
            ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}
          `}
          placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={style}
          {...props}
        />

        {iconRight && (
          <TouchableOpacity onPress={onPressIconRight} disabled={!onPressIconRight} className="ml-3">
            {iconRight}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-xs font-semibold mt-1.5 ml-1 text-brand-danger">
          {error}
        </Text>
      )}
    </View>
  );
};
