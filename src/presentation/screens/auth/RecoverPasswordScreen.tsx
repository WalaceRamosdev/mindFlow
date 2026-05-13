import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { Mail, ArrowLeft } from 'lucide-react-native';

export const RecoverPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleRecover = async () => {
    if (!email) {
      setError('Por favor, insira seu e-mail.');
      return;
    }
    setError(undefined);
    setIsLoading(true);

    try {
      // Simula recuperação de senha por e-mail
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert(
        'E-mail Enviado!',
        'Um link de recuperação de senha foi enviado para o seu endereço de e-mail.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível solicitar a recuperação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-darkBg px-6">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        
        {/* Voltar */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-4 left-0 p-2 flex-row items-center"
        >
          <ArrowLeft color="#94A3B8" size={24} />
          <Typography variant="bodyBold" color="subtext" className="ml-2 text-sm">
            Voltar
          </Typography>
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-10 items-start">
          <Typography variant="h1" className="text-white text-4xl font-extrabold mb-3">
            Recuperar Senha
          </Typography>
          <Typography variant="body" color="subtext" className="text-base leading-6">
            Insira o seu e-mail cadastrado e enviaremos um link seguro para você redefinir sua senha.
          </Typography>
        </View>

        {/* Input */}
        <Input
          label="E-mail de Cadastro"
          placeholder="Ex: seuemail@dominio.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={error}
          iconLeft={<Mail color="#64748B" size={20} />}
          themeOverride="dark"
        />

        {/* Botão Enviar */}
        <Button
          title="Enviar Link de Recuperação"
          onPress={handleRecover}
          variant="primary"
          isLoading={isLoading}
          className="py-4.5 mt-4"
        />

      </ScrollView>
    </SafeAreaView>
  );
};
