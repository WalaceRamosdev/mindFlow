import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Card } from '../../components/molecules/Card';
import { Avatar } from '../../components/atoms/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Shield, Moon, Eye, LogOut, ChevronRight, Bell, HelpCircle } from 'lucide-react-native';

export const PatientSettingsScreen: React.FC = () => {
  const { user, logout, enableBiometrics } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleBiometricToggle = async () => {
    if (user?.biometricEnabled) {
      Alert.alert('Desativar Biometria', 'Para desativar a biometria, por favor confirme no painel de segurança do seu aparelho.');
      return;
    }
    const success = await enableBiometrics();
    if (success) {
      Alert.alert('Sucesso! 🔒', 'Autenticação biométrica ativada para logins futuros.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair do App',
      'Tem certeza que deseja deslogar do MindFlow?',
      [
        { text: 'Sair', style: 'destructive', onPress: () => logout() },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-6">
        
        {/* Header */}
        <Typography variant="h1" className="text-2xl mb-8">Configurações</Typography>

        {/* Detalhes de Perfil */}
        <Card className="flex-row items-center p-5 mb-8">
          <Avatar source={user?.avatarUrl} size="lg" />
          <View className="flex-1 pl-4">
            <Typography variant="h2" className="text-lg">{user?.fullName}</Typography>
            <Typography variant="caption" color="subtext" className="text-sm mt-0.5">{user?.email}</Typography>
            <Typography variant="captionBold" color="primary" className="text-xs uppercase mt-2 tracking-wider">
              {user?.role === 'patient' ? 'Paciente Verificado' : 'Profissional Clínico'}
            </Typography>
          </View>
        </Card>

        {/* Preferências do Aplicativo */}
        <Typography variant="h2" className="mb-4">Preferências</Typography>
        <Card className="mb-8 p-0 overflow-hidden">
          {/* Modo Escuro */}
          <View className="flex-row items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-brand-primary/10 rounded-2xl items-center justify-center mr-4">
                <Moon color="#0D9488" size={20} />
              </View>
              <View>
                <Typography variant="bodyBold" className="text-sm">Modo Escuro (Dark Mode)</Typography>
                <Typography variant="caption" color="subtext" className="text-xs mt-0.5">Interface amigável para a noite</Typography>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#0D9488' }}
              thumbColor={isDark ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          {/* Notificações Push */}
          <View className="flex-row items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-brand-primary/10 rounded-2xl items-center justify-center mr-4">
                <Bell color="#0D9488" size={20} />
              </View>
              <View>
                <Typography variant="bodyBold" className="text-sm">Lembretes de Consulta</Typography>
                <Typography variant="caption" color="subtext" className="text-xs mt-0.5">Alertas push automáticos e SMS</Typography>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#0D9488' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          {/* Segurança de Biometria */}
          <View className="flex-row items-center justify-between p-5">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-brand-primary/10 rounded-2xl items-center justify-center mr-4">
                <Shield color="#0D9488" size={20} />
              </View>
              <View>
                <Typography variant="bodyBold" className="text-sm">Autenticação por Biometria</Typography>
                <Typography variant="caption" color="subtext" className="text-xs mt-0.5">Acesso via Face ID ou impressão digital</Typography>
              </View>
            </View>
            <Switch
              value={user?.biometricEnabled || false}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: '#767577', true: '#0D9488' }}
              thumbColor={user?.biometricEnabled ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </Card>

        {/* Suporte e Ajuda */}
        <Typography variant="h2" className="mb-4">Segurança & Termos</Typography>
        <Card className="mb-8 p-0 overflow-hidden">
          <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-brand-primary/10 rounded-2xl items-center justify-center mr-4">
                <Eye color="#0D9488" size={20} />
              </View>
              <Typography variant="bodyBold" className="text-sm">Privacidade de Dados (LGPD)</Typography>
            </View>
            <ChevronRight color="#94A3B8" size={18} />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-5">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-brand-primary/10 rounded-2xl items-center justify-center mr-4">
                <HelpCircle color="#0D9488" size={20} />
              </View>
              <Typography variant="bodyBold" className="text-sm">Suporte & Central de Ajuda</Typography>
            </View>
            <ChevronRight color="#94A3B8" size={18} />
          </TouchableOpacity>
        </Card>

        {/* Botão de Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-brand-danger/10 py-5 rounded-3xl border border-brand-danger/20 mb-14"
        >
          <LogOut color="#EF4444" size={20} />
          <Typography variant="bodyBold" color="danger" className="pl-2 text-sm">
            Sair do Aplicativo
          </Typography>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};
