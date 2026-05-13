import React from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Typography } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useThemeStore } from '../../store/useThemeStore';
import { ArrowLeft, Star, Heart, Award, Clock, Coins, ShieldCheck } from 'lucide-react-native';

export const TherapistProfileScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { therapistId } = route.params;
  const { therapists } = useAppointmentStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const therapist = therapists.find((t) => t.id === therapistId);

  if (!therapist) {
    return (
      <SafeAreaView className="flex-1 bg-brand-darkBg items-center justify-center">
        <Typography variant="h3">Psicólogo não encontrado</Typography>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      
      {/* Header Botões */}
      <View className="flex-row justify-between items-center px-6 pt-4 mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-slate-800/10 rounded-full">
          <ArrowLeft color={isDark ? 'white' : 'black'} size={24} />
        </TouchableOpacity>
        <TouchableOpacity className="p-2 bg-slate-800/10 rounded-full">
          <Heart color="#EF4444" size={24} fill="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-6">
        {/* Foto de Perfil Grande e Informações Básicas */}
        <View className="items-center mb-8">
          <Avatar source={therapist.user?.avatarUrl} size="xl" className="border-4 border-brand-primary" />
          <View className="flex-row items-center mt-4">
            <Typography variant="h1" className="text-2xl font-bold mr-1.5 text-center">
              {therapist.user?.fullName}
            </Typography>
            {therapist.isApproved && <ShieldCheck color="#0D9488" size={20} />}
          </View>
          <Typography variant="body" color="subtext" className="mt-1 text-sm">
            {therapist.crp}
          </Typography>

          <View className="flex-row flex-wrap justify-center gap-2 mt-3">
            {therapist.specialties.map((spec) => (
              <Badge key={spec} label={spec} variant="primary" />
            ))}
          </View>
        </View>

        {/* Linha de Indicadores e Estatísticas */}
        <View className="flex-row justify-around border-t border-b border-slate-200 dark:border-slate-800 py-6 mb-8">
          <View className="items-center">
            <Star color="#F59E0B" size={24} fill="#F59E0B" />
            <Typography variant="h3" className="mt-1.5 text-base">
              {therapist.rating.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="subtext">
              Avaliação
            </Typography>
          </View>

          <View className="items-center">
            <Award color="#4F46E5" size={24} />
            <Typography variant="h3" className="mt-1.5 text-base">
              {therapist.yearsOfExperience} anos
            </Typography>
            <Typography variant="caption" color="subtext">
              Experiência
            </Typography>
          </View>

          <View className="items-center">
            <Coins color="#0D9488" size={24} />
            <Typography variant="h3" className="mt-1.5 text-base">
              R$ {therapist.pricePerSession.toFixed(0)}
            </Typography>
            <Typography variant="caption" color="subtext">
              Valor / Sessão
            </Typography>
          </View>
        </View>

        {/* Biografia */}
        <Typography variant="h2" className="mb-3">
          Sobre o Profissional
        </Typography>
        <Typography variant="body" color="subtext" className="text-base leading-6 text-justify mb-8">
          {therapist.bio}
        </Typography>

        {/* Segurança e Conformidade */}
        <View className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl flex-row items-start mb-10">
          <Clock color="#0D9488" size={20} className="mt-0.5" />
          <View className="flex-1 pl-3">
            <Typography variant="captionBold" color="primary" className="text-sm">
              Sessão de 50 Minutos
            </Typography>
            <Typography variant="caption" color="subtext" className="mt-1 leading-5">
              Sessões online seguras com criptografia WebRTC e prontuário digital seguro protegido por senha e biometria.
            </Typography>
          </View>
        </View>

      </ScrollView>

      {/* Botão de Agendamento Fixo Inferior */}
      <View className="p-6 border-t border-slate-100 dark:border-slate-800">
        <Button
          title="Agendar Sessão"
          onPress={() => navigation.navigate('BookAppointment', { therapistId })}
          variant="primary"
          className="w-full py-4"
        />
      </View>

    </SafeAreaView>
  );
};
