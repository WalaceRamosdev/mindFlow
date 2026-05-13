import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
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
  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const { appointments, therapists } = useAppointmentStore();
  const isDark = theme === 'dark';

  // Filtra as consultas agendadas futuras
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed' || apt.status === 'pending'
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-6">
        
        {/* Header Perfil do Usuário */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Typography variant="body" color="subtext" className="text-sm">
              Olá, bem-vindo de volta 👋
            </Typography>
            <Typography variant="h1" className="text-2xl mt-1">
              {user?.fullName}
            </Typography>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('PatientSettings')}>
            <Avatar source={user?.avatarUrl} size="md" />
          </TouchableOpacity>
        </View>

        {/* Card de Próxima Consulta */}
        <Typography variant="h2" className="mb-4">
          Próxima Consulta
        </Typography>

        {upcomingAppointments.length > 0 ? (
          <Card className="mb-8 overflow-hidden bg-brand-primary/10 border-brand-primary/20">
            <View className="flex-row items-center justify-between mb-4">
              <Badge label="Confirmada" variant="success" />
              <View className="flex-row items-center">
                <Calendar color="#0D9488" size={16} />
                <Typography variant="captionBold" color="primary" className="ml-1.5">
                  {new Date(upcomingAppointments[0].scheduledTime).toLocaleDateString('pt-BR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </Typography>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <Avatar source={upcomingAppointments[0].therapist?.user?.avatarUrl} size="md" />
              <View className="flex-1 pl-4">
                <Typography variant="h3" className="text-lg">
                  {upcomingAppointments[0].therapist?.user?.fullName}
                </Typography>
                <Typography variant="caption" color="subtext" className="mt-0.5">
                  {upcomingAppointments[0].therapist?.crp} • {upcomingAppointments[0].therapist?.specialties[0]}
                </Typography>
              </View>
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
              <Typography variant="bodyBold" className="text-white ml-2">
                Acessar Sala de Vídeo
              </Typography>
            </TouchableOpacity>
          </Card>
        ) : (
          <Card className="mb-8 items-center py-8">
            <Typography variant="body" color="subtext" className="text-center mb-4">
              Nenhuma consulta agendada para os próximos dias.
            </Typography>
            <TouchableOpacity
              onPress={() => navigation.navigate('PatientSearch')}
              className="flex-row items-center"
            >
              <Typography variant="bodyBold" color="primary" className="mr-1">
                Agendar uma sessão agora
              </Typography>
              <ArrowRight color="#0D9488" size={16} />
            </TouchableOpacity>
          </Card>
        )}

        {/* Psicólogos Recomendados */}
        <View className="flex-row justify-between items-center mb-4">
          <Typography variant="h2">Psicólogos Recomendados</Typography>
          <TouchableOpacity onPress={() => navigation.navigate('PatientSearch')}>
            <Typography variant="captionBold" color="primary">Ver Todos</Typography>
          </TouchableOpacity>
        </View>

        <View className="space-y-4 mb-10">
          {therapists.slice(0, 2).map((therapist) => (
            <Card
              key={therapist.id}
              onPress={() => navigation.navigate('TherapistProfile', { therapistId: therapist.id })}
              className="flex-row p-4"
            >
              <Avatar source={therapist.user?.avatarUrl} size="md" />
              
              <View className="flex-1 pl-4 justify-between">
                <View>
                  <View className="flex-row justify-between items-start">
                    <Typography variant="h3" className="text-base">
                      {therapist.user?.fullName}
                    </Typography>
                    <Heart color="#EF4444" size={16} fill="#EF4444" />
                  </View>
                  <Typography variant="caption" color="subtext" className="mt-0.5">
                    {therapist.specialties.join(' • ')}
                  </Typography>
                </View>

                <View className="flex-row justify-between items-center mt-3">
                  <View className="flex-row items-center">
                    <Star color="#F59E0B" size={14} fill="#F59E0B" />
                    <Typography variant="captionBold" className="ml-1 text-sm">
                      {therapist.rating.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="subtext" className="ml-1">
                      ({therapist.yearsOfExperience} anos exp)
                    </Typography>
                  </View>
                  <Typography variant="bodyBold" color="primary">
                    R$ {therapist.pricePerSession.toFixed(0)}/sessão
                  </Typography>
                </View>
              </View>
            </Card>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
