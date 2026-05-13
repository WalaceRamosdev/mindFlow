import React from 'react';
import { View, Image } from 'react-native';

interface AvatarProps {
  source?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ source, size = 'md', isOnline = false, className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-full',
    md: 'w-14 h-14 rounded-full',
    lg: 'w-20 h-20 rounded-full',
    xl: 'w-28 h-28 rounded-full',
  };

  const indicatorSizeClasses = {
    sm: 'w-3 h-3 border-2',
    md: 'w-4.5 h-4.5 border-2.5',
    lg: 'w-5.5 h-5.5 border-3',
    xl: 'w-7 h-7 border-4',
  };

  const fallbackUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <View className="relative self-center">
      <Image
        source={{ uri: source || fallbackUrl }}
        className={`${sizeClasses[size]} bg-slate-200 ${className}`}
      />
      {isOnline && (
        <View
          className={`absolute bottom-0 right-0 rounded-full bg-brand-success border-white dark:border-brand-darkBg ${indicatorSizeClasses[size]}`}
        />
      )}
    </View>
  );
};
