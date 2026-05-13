import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Typography } from './Typography';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  className = '',
}) => {
  const baseClasses = 'flex-row items-center justify-center rounded-2xl active:opacity-85 shadow-sm';
  
  const sizeClasses = {
    sm: 'px-4 py-2.5',
    md: 'px-6 py-3.5',
    lg: 'px-8 py-4.5',
  };

  const variantClasses = {
    primary: 'bg-brand-primary shadow-brand-primary/20',
    secondary: 'bg-brand-secondary shadow-brand-secondary/20',
    outline: 'border-2 border-brand-primary bg-transparent',
    ghost: 'bg-transparent',
    danger: 'bg-brand-danger shadow-brand-danger/20',
  };

  const textColors = {
    primary: 'white' as const,
    secondary: 'white' as const,
    outline: 'primary' as const,
    ghost: 'primary' as const,
    danger: 'white' as const,
  };

  const textVariants = {
    sm: 'captionBold' as const,
    md: 'bodyBold' as const,
    lg: 'bodyBold' as const,
  };

  const isOutlineOrGhost = variant === 'outline' || variant === 'ghost';
  const loaderColor = isOutlineOrGhost ? '#0D9488' : '#FFFFFF';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
      style={{ elevation: isOutlineOrGhost ? 0 : 4 }}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Typography
            variant={textVariants[size]}
            color={textColors[variant]}
            className="text-center"
          >
            {title}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
};
