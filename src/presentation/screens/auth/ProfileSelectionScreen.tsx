import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Card } from '../../components/molecules/Card';
import { User, Activity } from 'lucide-react-native';

export const ProfileSelectionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-brand-darkBg px-6 justify-center">
      <View className="mb-10 items-center">
        <Typography variant="h1" className="text-white text-3xl font-extrabold mb-3 text-center">
          Como deseja acessar?
        </Typography>
        <Typography variant="body" className="text-center text-base px-6 text-slate-400">
          Selecione o seu perfil para personalizarmos sua experiência.
        </Typography>
      </View>
 
      <View style={{ gap: 20 }} className="flex-col">
        {/* Opção Paciente */}
        <Card
          onPress={() => navigation.navigate('Login', { role: 'patient' })}
          className="border-2 border-brand-primary/10 hover:border-brand-primary p-6"
          themeOverride="dark"
        >
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-brand-primary/20 rounded-2xl items-center justify-center">
              <User color="#0D9488" size={32} />
            </View>
            <View className="flex-1 pl-4">
              <Typography variant="h2" className="text-white text-xl mb-1">
                Sou Paciente
              </Typography>
              <Typography variant="caption" className="text-sm text-slate-400">
                Quero buscar psicólogos, agendar sessões de terapia e acompanhar meus tratamentos.
              </Typography>
            </View>
          </View>
        </Card>
 
        {/* Opção Psicólogo */}
        <Card
          onPress={() => navigation.navigate('Login', { role: 'therapist' })}
          className="border-2 border-brand-secondary/10 hover:border-brand-secondary p-6"
          themeOverride="dark"
        >
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-brand-secondary/20 rounded-2xl items-center justify-center">
              <Activity color="#4F46E5" size={32} />
            </View>
            <View className="flex-1 pl-4">
              <Typography variant="h2" className="text-white text-xl mb-1">
                Sou Psicólogo CRP
              </Typography>
              <Typography variant="caption" className="text-sm text-slate-400">
                Quero disponibilizar minha agenda, realizar atendimentos clínicos e gerenciar prontuários médicos.
              </Typography>
            </View>
          </View>
        </Card>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login', { role: 'admin' })}
        className="mt-12 self-center"
      >
        <Typography variant="captionBold" color="subtext" className="text-sm underline">
          Entrar como Administrador
        </Typography>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
