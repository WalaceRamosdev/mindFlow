import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image, Dimensions } from 'react-native';
import { Typography } from '../../components/atoms/Typography';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';

export const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { checkPersistedSession } = useAuthStore();
  const { loadTheme } = useThemeStore();

  useEffect(() => {
    // Inicializa recursos e autenticação
    const initApp = async () => {
      await loadTheme();
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Tempo de splash screen premium
      await checkPersistedSession();

      const isAuth = useAuthStore.getState().isAuthenticated;
      if (!isAuth && navigation) {
        navigation.replace('Onboarding');
      }
    };
    initApp();
  }, []);

  return (
    <View className="flex-1 bg-brand-darkBg items-center justify-center px-6">
      <View className="items-center">
        {/* Ícone de logotipo representativo (Cura / Mente) */}
        <View className="w-24 h-24 bg-brand-primary/20 rounded-full items-center justify-center mb-6">
          <View className="w-16 h-16 bg-brand-primary/35 rounded-full items-center justify-center">
            <View className="w-10 h-10 bg-brand-primary rounded-full items-center justify-center shadow-lg shadow-brand-primary/50" />
          </View>
        </View>

        <Typography variant="h1" className="text-white font-extrabold text-4xl mb-2 text-center tracking-wider">
          Mind<Typography variant="h1" className="text-brand-primary font-extrabold text-4xl">Flow</Typography>
        </Typography>

        <Typography variant="body" className="text-brand-darkSubtext text-center text-sm tracking-widest uppercase mb-12">
          Sua mente em equilíbrio constante
        </Typography>

        <ActivityIndicator size="large" color="#0D9488" />
      </View>

      <Typography variant="caption" className="absolute bottom-10 text-brand-darkSubtext/40 text-center tracking-wide">
        Seguro • Encriptado de Ponta a Ponta • LGPD
      </Typography>
    </View>
  );
};
