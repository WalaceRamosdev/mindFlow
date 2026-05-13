import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { Mail, Lock, ShieldCheck, Fingerprint } from 'lucide-react-native';

export const LoginScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const role = route.params?.role || 'patient';
  const { login, isLoading, error, biometricSupported, authenticateWithBiometrics, user } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    // Tenta login biométrico ao carregar se o usuário tiver ativado
    const tryBiometrics = async () => {
      if (biometricSupported) {
        const success = await authenticateWithBiometrics();
        if (success) {
          Alert.alert('Bem-vindo de volta!', 'Autenticação biométrica bem-sucedida.');
        }
      }
    };
    tryBiometrics();
  }, [biometricSupported]);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Por favor, insira um e-mail válido.';
    }

    if (!password) {
      errors.password = 'A senha é obrigatória.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve conter no mínimo 6 caracteres.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    const success = await login(email, password, role);
    if (!success && error) {
      Alert.alert('Erro no Login', error);
    }
  };

  const handleBiometricPress = async () => {
    const success = await authenticateWithBiometrics();
    if (!success) {
      Alert.alert('Falha na Biometria', 'Não foi possível autenticar por biometria. Use seu e-mail e senha.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-darkBg">
      <ScrollView showsVerticalScrollIndicator={false} className="px-6" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        
        {/* Header */}
        <View className="mb-10 items-start">
          <Typography variant="h1" className="text-white text-4xl font-extrabold mb-2">
            Bem-vindo!
          </Typography>
          <Typography variant="body" color="subtext" className="text-base">
            Entre para gerenciar seus agendamentos e consultas clínicas.
          </Typography>
        </View>

        {/* Campos do Formulário */}
        <View className="flex-col gap-4">
          <Input
            label="Seu E-mail"
            placeholder="Ex: gabriel@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email}
            iconLeft={<Mail color="#64748B" size={20} />}
            themeOverride="dark"
          />

          <Input
            label="Sua Senha"
            placeholder="No mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            error={formErrors.password}
            iconLeft={<Lock color="#64748B" size={20} />}
            themeOverride="dark"
          />
        </View>

        {/* Recuperar Senha */}
        <TouchableOpacity
          onPress={() => navigation.navigate('RecoverPassword')}
          className="self-end mt-2 mb-8"
        >
          <Typography variant="captionBold" color="primary" className="text-sm">
            Esqueceu sua senha?
          </Typography>
        </TouchableOpacity>

        {/* Botões de Ação */}
        <View className="flex-col gap-4">
          <Button
            title="Entrar"
            onPress={handleLogin}
            variant={role === 'therapist' ? 'secondary' : 'primary'}
            isLoading={isLoading}
            className="py-4.5"
          />

          {/* Botão de Biometria se suportado */}
          {biometricSupported && (
            <TouchableOpacity
              onPress={handleBiometricPress}
              className="flex-row items-center justify-center border-2 border-slate-800 rounded-2xl py-3.5 mt-4"
            >
              <Fingerprint color="#94A3B8" size={24} className="mr-2" />
              <Typography variant="bodyBold" color="subtext" className="pl-2">
                Acessar com Biometria
              </Typography>
            </TouchableOpacity>
          )}
        </View>

        {/* Cadastrar-se */}
        <View className="flex-row justify-center mt-12 mb-6">
          <Typography variant="body" color="subtext" className="text-sm mr-1">
            Não possui uma conta?
          </Typography>
          <TouchableOpacity onPress={() => navigation.navigate('Register', { role })}>
            <Typography variant="bodyBold" color="primary" className="text-sm">
              Cadastre-se
            </Typography>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
