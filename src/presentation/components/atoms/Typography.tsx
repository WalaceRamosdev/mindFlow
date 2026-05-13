import React from 'react';
import { Text, TextProps } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'caption' | 'captionBold';
  color?: 'primary' | 'secondary' | 'accent' | 'text' | 'subtext' | 'contrast' | 'danger' | 'success';
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color = 'text',
  className = '',
  style,
  ...props
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Classes de tipografia (Tamanhos e Pesos)
  const variantClasses = {
    h1: 'text-3xl font-extrabold tracking-tight',
    h2: 'text-xl font-bold tracking-tight',
    h3: 'text-lg font-semibold',
    body: 'text-base font-normal leading-6',
    bodyBold: 'text-base font-semibold leading-6',
    caption: 'text-xs font-normal leading-4',
    captionBold: 'text-xs font-semibold leading-4',
  };

  // Cores dinâmicas de acordo com o tema global
  const colorClasses = {
    primary: 'text-brand-primary',
    secondary: 'text-brand-secondary',
    accent: 'text-brand-accent',
    danger: 'text-brand-danger',
    success: 'text-brand-success',
    text: isDark ? 'text-brand-darkText' : 'text-brand-lightText',
    subtext: isDark ? 'text-brand-darkSubtext' : 'text-brand-lightSubtext',
    contrast: isDark ? 'text-brand-lightText' : 'text-brand-darkText', // Invertido
  };

  const combinedClasses = `${variantClasses[variant]} ${colorClasses[color]} ${className}`;

  return (
    <Text className={combinedClasses} style={style} {...props}>
      {children}
    </Text>
  );
};
