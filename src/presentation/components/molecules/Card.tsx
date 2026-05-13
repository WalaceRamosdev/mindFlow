import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  elevation?: number;
  themeOverride?: 'dark' | 'light';
}

export const Card: React.FC<CardProps> = ({ children, onPress, className = '', elevation = 4, themeOverride }) => {
  const { theme } = useThemeStore();
  const isDark = themeOverride ? themeOverride === 'dark' : theme === 'dark';

  const baseClasses = `rounded-3xl p-5 border transition-all ${
    isDark
      ? 'bg-brand-darkSurface border-slate-800'
      : 'bg-brand-lightSurface border-slate-100 shadow-slate-100'
  } ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        className={baseClasses}
        style={{
          shadowColor: isDark ? '#000000' : '#E2E8F0',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.4 : 0.08,
          shadowRadius: 10,
          elevation,
        }}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      className={baseClasses}
      style={{
        shadowColor: isDark ? '#000000' : '#E2E8F0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.08,
        shadowRadius: 10,
        elevation,
      }}
    >
      {children}
    </View>
  );
};
