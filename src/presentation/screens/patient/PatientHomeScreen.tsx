import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Card } from '../../components/molecules/Card';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Calendar, Video, ArrowRight, Star, Heart } from 'lucide-react-native';

export const PatientHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const { appointments, therapists } = useAppointmentStore();
  const isDark = theme === 'dark';

  // Filtra as consultas agendadas futuras
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed' || apt.status === 'pending'
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 50 }}
      >
        <View className="flex-col gap-8 w-full items-stretch">
          
          {/* Header Perfil do Usuário: Totalmente Centrado */}
          <View className="items-center justify-center">
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('PatientSettings')} 
              className="mb-3"
            >
              <Avatar source={user?.avatarUrl} size="lg" className="self-center" />
            </TouchableOpacity>
            <Typography variant="body" color="subtext" className="text-sm text-center">
              Olá, bem-vindo de volta 👋
            </Typography>
            <Typography variant="h1" className="text-2xl font-extrabold mt-1 text-center">
              {user?.fullName}
            </Typography>
          </View>

          {/* Seção da Próxima Consulta */}
          <View className="flex-col gap-4">
            <Typography variant="h2" className="text-lg font-bold text-center">
              Próxima Consulta
            </Typography>

            {upcomingAppointments.length > 0 ? (
              <Card elevation={0} className="overflow-hidden bg-brand-primary/10 border-brand-primary/20">
                <View className="flex-row items-center justify-between mb-4">
                  <Badge label="Confirmada" variant="success" />
                  <View className="flex-row items-center">
                    <Calendar color="#0D9488" size={16} />
                    <Typography variant="captionBold" color="primary" className="ml-1.5 text-xs">
                      {new Date(upcomingAppointments[0].scheduledTime).toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Typography>
                  </View>
                </View>

                {/* Info & Avatar Lado a Lado (Space Between) */}
                <View className="flex-row items-center justify-between mb-5">
                  <View className="flex-1 pr-4">
                    <Typography variant="h3" className="text-lg font-bold">
                      {upcomingAppointments[0].therapist?.user?.fullName}
                    </Typography>
                    <Typography variant="caption" color="subtext" className="text-sm mt-0.5">
                      {upcomingAppointments[0].therapist?.crp} • {upcomingAppointments[0].therapist?.specialties[0]}
                    </Typography>
                  </View>
                  <Avatar source={upcomingAppointments[0].therapist?.user?.avatarUrl} size="md" className="self-auto" />
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('VideoCall', {
                    roomId: upcomingAppointments[0].videoRoomId,
                    appointmentId: upcomingAppointments[0].id,
                    doctorName: upcomingAppointments[0].therapist?.user?.fullName || '',
                  })}
                  className="bg-brand-primary flex-row items-center justify-center py-3.5 rounded-2xl"
                >
                  <Video color="white" size={18} />
                  <Typography variant="bodyBold" className="text-white ml-2 text-sm">
                    Acessar Sala de Vídeo
                  </Typography>
                </TouchableOpacity>
              </Card>
            ) : (
              <Card elevation={0} className="items-center py-8">
                <Typography variant="body" color="subtext" className="text-center mb-4 text-sm">
                  Nenhuma consulta agendada para os próximos dias.
                </Typography>
                <TouchableOpacity
                  onPress={() => navigation.navigate('PatientSearch')}
                  className="flex-row items-center justify-center"
                >
                  <Typography variant="bodyBold" color="primary" className="mr-1 text-sm">
                    Agendar uma sessão agora
                  </Typography>
                  <ArrowRight color="#0D9488" size={16} />
                </TouchableOpacity>
              </Card>
            )}
          </View>

          {/* Psicólogos Recomendados */}
          <View className="flex-col gap-4">
            <View className="items-center justify-center">
              <Typography variant="h2" className="text-lg font-bold text-center">Psicólogos Recomendados</Typography>
              <TouchableOpacity onPress={() => navigation.navigate('PatientSearch')} className="mt-1.5">
                <Typography variant="captionBold" color="primary" className="text-xs uppercase tracking-wider">
                  Ver Todos
                </Typography>
              </TouchableOpacity>
            </View>

            {/* Lista de Psicólogos com margem de separação garantida */}
            <View className="flex-col">
              {therapists.slice(0, 2).map((therapist) => (
                <Card
                  elevation={0}
                  key={therapist.id}
                  onPress={() => navigation.navigate('TherapistProfile', { therapistId: therapist.id })}
                  className="p-5 flex-row items-center justify-between border border-slate-150 dark:border-slate-800 mb-5"
                >
                  {/* Bloco de Informações na Esquerda */}
                  <View className="flex-1 pr-4 justify-between">
                    <View>
                      <View className="flex-row items-center justify-between">
                        <Typography variant="h3" className="text-base font-bold">
                          {therapist.user?.fullName}
                        </Typography>
                        <Heart color="#EF4444" size={15} fill="#EF4444" className="mr-1" />
                      </View>
                      <Typography variant="caption" color="subtext" className="text-xs mt-1">
                        {therapist.specialties.join(' • ')}
                      </Typography>
                    </View>

                    {/* Métricas e Preço na Esquerda (Logo abaixo do Nome/Especialidades) */}
                    <View className="flex-row justify-between items-center mt-4">
                      <View className="flex-row items-center">
                        <Star color="#F59E0B" size={13} fill="#F59E0B" />
                        <Typography variant="captionBold" className="ml-1 text-xs font-semibold">
                          {therapist.rating.toFixed(1)}
                        </Typography>
                        <Typography variant="caption" color="subtext" className="ml-1.5 text-xs">
                          ({therapist.yearsOfExperience} anos exp)
                        </Typography>
                      </View>
                      <Typography variant="bodyBold" color="primary" className="text-xs font-bold">
                        R$ {therapist.pricePerSession.toFixed(0)}/sessão
                      </Typography>
                    </View>
                  </View>

                  {/* Avatar na Extrema Direita (Space-Between) */}
                  <Avatar source={therapist.user?.avatarUrl} size="md" className="self-auto" />
                </Card>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
