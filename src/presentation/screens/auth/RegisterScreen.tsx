import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Mail, Lock, ShieldAlert } from 'lucide-react-native';

export const RegisterScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const role = route.params?.role || 'patient';
  const { register, isLoading, error } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [crp, setCrp] = useState('');
  const [formErrors, setFormErrors] = useState<{ fullName?: string; email?: string; password?: string; crp?: string }>({});

  const validateForm = () => {
    const errors: typeof formErrors = {};
    if (!fullName) errors.fullName = 'O nome completo é obrigatório.';
    if (!email) {
      errors.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Insira um e-mail válido.';
    }

    if (!password) {
      errors.password = 'A senha é obrigatória.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve possuir pelo menos 6 caracteres.';
    }

    if (role === 'therapist' && !crp) {
      errors.crp = 'O CRP de registro é obrigatório para psicólogos.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    const success = await register(fullName, email, password, role, crp);
    if (success) {
      Alert.alert('Sucesso!', 'Seu cadastro foi realizado com sucesso.');
    } else if (error) {
      Alert.alert('Erro no Cadastro', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-darkBg">
      <ScrollView showsVerticalScrollIndicator={false} className="px-6" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        
        {/* Header */}
        <View className="mb-8 items-start">
          <Typography variant="h1" className="text-white text-4xl font-extrabold mb-2">
            Criar Conta
          </Typography>
          <Typography variant="body" color="subtext" className="text-base">
            Preencha seus dados para começar a usar a plataforma.
          </Typography>
        </View>

        {/* Formulário */}
        <View className="flex-col gap-4">
          <Input
            label="Nome Completo"
            placeholder="Ex: Gabriel Vasconcelos"
            value={fullName}
            onChangeText={setFullName}
            error={formErrors.fullName}
            iconLeft={<User color="#64748B" size={20} />}
            themeOverride="dark"
          />

          <Input
            label="E-mail"
            placeholder="Ex: gabriel@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email}
            iconLeft={<Mail color="#64748B" size={20} />}
            themeOverride="dark"
          />

          {role === 'therapist' && (
            <Input
              label="CRP (Conselho Regional)"
              placeholder="Ex: CRP 06/123456"
              value={crp}
              onChangeText={setCrp}
              error={formErrors.crp}
              iconLeft={<ShieldAlert color="#64748B" size={20} />}
              themeOverride="dark"
            />
          )}

          <Input
            label="Senha de Acesso"
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

        {/* Políticas LGPD */}
        <Typography variant="caption" color="subtext" className="text-xs mt-4 mb-8 leading-5">
          Ao se cadastrar, você concorda com nossos <Typography variant="captionBold" color="primary">Termos de Uso</Typography> e com a <Typography variant="captionBold" color="primary">Política de Privacidade</Typography> (compatível com a LGPD).
        </Typography>

        {/* Botão Cadastrar */}
        <Button
          title="Cadastrar"
          onPress={handleRegister}
          variant={role === 'therapist' ? 'secondary' : 'primary'}
          isLoading={isLoading}
          className="py-4.5"
        />

        {/* Voltar para login */}
        <View className="flex-row justify-center mt-8 mb-6">
          <Typography variant="body" color="subtext" className="text-sm mr-1">
            Já possui uma conta?
          </Typography>
          <TouchableOpacity onPress={() => navigation.navigate('Login', { role })}>
            <Typography variant="bodyBold" color="primary" className="text-sm">
              Fazer Login
            </Typography>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
