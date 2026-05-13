import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', className = '' }) => {
  const variantBgClasses = {
    primary: 'bg-brand-primary/10',
    secondary: 'bg-brand-secondary/10',
    success: 'bg-brand-success/10',
    warning: 'bg-brand-warning/10',
    danger: 'bg-brand-danger/10',
    info: 'bg-slate-500/10',
  };

  const variantTextColors = {
    primary: 'primary' as const,
    secondary: 'secondary' as const,
    success: 'success' as const,
    warning: 'warning' as const,
    danger: 'danger' as const,
    info: 'subtext' as const,
  };

  return (
    <View className={`px-3 py-1 rounded-full items-center justify-center self-start ${variantBgClasses[variant]} ${className}`}>
      <Typography variant="captionBold" color={variantTextColors[variant]} className="text-center">
        {label}
      </Typography>
    </View>
  );
};
