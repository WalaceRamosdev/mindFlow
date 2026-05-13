import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import { useAuthStore } from './src/presentation/store/useAuthStore';
import { useThemeStore } from './src/presentation/store/useThemeStore';
import { RootNavigator } from './src/presentation/navigation';

// Ignora o aviso intrusivo de Push Notifications no Expo Go do SDK 54/53
LogBox.ignoreLogs(['expo-notifications: Android Push notifications']);

export default function App() {
  const { loadTheme, theme } = useThemeStore();
  const { checkPersistedSession } = useAuthStore();

  useEffect(() => {
    // Carrega preferências do tema (Light/Dark Mode) e restaura sessões persistidas com segurança
    const bootstrapApp = async () => {
      await loadTheme();
      await checkPersistedSession();
    };
    bootstrapApp();
  }, []);

  const isDark = theme === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* StatusBar inteligente baseada no tema ativo */}
        <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={isDark ? '#0B0F19' : '#F8FAFC'} />
        
        {/* Renderiza o fluxo de rotas principal do app */}
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
