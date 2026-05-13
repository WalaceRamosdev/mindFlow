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
import { Calendar, TrendingUp, Users, DollarSign, ArrowRight, Video } from 'lucide-react-native';

export const TherapistDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const { appointments } = useAppointmentStore();
  const isDark = theme === 'dark';

  // Métricas do Psicólogo
  const totalPatients = 14;
  const todayAppointments = appointments.filter(apt => apt.status === 'confirmed');
  const monthEarnings = 4250.00;

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-6">
        
        {/* Header Profissional */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Typography variant="body" color="subtext" className="text-sm">
              Bom dia, Dr.
            </Typography>
            <Typography variant="h1" className="text-2xl mt-1">
              {user?.fullName}
            </Typography>
          </View>
          <Avatar source={user?.avatarUrl} size="md" />
        </View>

        {/* Linha de Métricas Rápidas */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mb-8 h-28"
          contentContainerStyle={{ gap: 16, justifyContent: 'center', minWidth: '100%', paddingHorizontal: 24 }}
        >
          
          {/* Faturamento do Mês */}
          <Card className="w-40 bg-brand-primary p-5 border-transparent shadow-lg shadow-brand-primary/20">
            <DollarSign color="white" size={24} />
            <Typography variant="caption" className="text-white/70 text-xs mt-3">Receita do Mês</Typography>
            <Typography variant="h2" className="text-white font-bold text-lg mt-0.5">R$ {monthEarnings.toFixed(0)}</Typography>
          </Card>

          {/* Consultas de Hoje */}
          <Card className="w-40 p-5">
            <Calendar color="#4F46E5" size={24} />
            <Typography variant="caption" color="subtext" className="text-xs mt-3">Sessões de Hoje</Typography>
            <Typography variant="h2" className="font-bold text-lg mt-0.5">{todayAppointments.length} agendadas</Typography>
          </Card>

          {/* Pacientes Ativos */}
          <Card className="w-40 p-5">
            <Users color="#8B5CF6" size={24} />
            <Typography variant="caption" color="subtext" className="text-xs mt-3">Pacientes Ativos</Typography>
            <Typography variant="h2" className="font-bold text-lg mt-0.5">{totalPatients} ativos</Typography>
          </Card>

        </ScrollView>

        {/* Agenda de Hoje */}
        <View className="flex-row justify-between items-center mt-6 mb-5">
          <Typography variant="h2">Agenda de Hoje</Typography>
          <TouchableOpacity onPress={() => navigation.navigate('TherapistAgenda')}>
            <Typography variant="captionBold" color="secondary">Ver Completa</Typography>
          </TouchableOpacity>
        </View>

        {todayAppointments.length > 0 ? (
          <View className="flex-col gap-4 mb-10">
            {todayAppointments.map((apt) => (
              <Card key={apt.id} className="p-4 flex-row items-center border-l-4 border-l-brand-secondary">
                <Avatar source="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" size="md" />
                
                <View className="flex-1 pl-4">
                  <Typography variant="h3" className="text-base">Gabriel Vasconcelos</Typography>
                  <Typography variant="caption" color="subtext" className="mt-0.5">
                    Hoje, às {new Date(apt.scheduledTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • 50 min
                  </Typography>

                  <View className="flex-row gap-3 mt-3.5">
                    <TouchableOpacity
                      onPress={() => navigation.navigate('VideoCall', {
                        roomId: apt.videoRoomId,
                        appointmentId: apt.id,
                        doctorName: user?.fullName || '',
                      })}
                      className="bg-brand-secondary/10 px-4 py-2 rounded-xl flex-row items-center"
                    >
                      <Video color="#4F46E5" size={14} />
                      <Typography variant="captionBold" color="secondary" className="pl-1.5 text-xs">Atender Vídeo</Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('MedicalRecordEdit', {
                        appointmentId: apt.id,
                        patientId: apt.patientId,
                        patientName: 'Gabriel Vasconcelos',
                      })}
                      className="border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl"
                    >
                      <Typography variant="captionBold" color="subtext" className="text-xs">Evolução</Typography>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card className="mb-10 items-center py-8">
            <Typography variant="body" color="subtext" className="text-center mb-2">
              Sua agenda para hoje está livre!
            </Typography>
            <Typography variant="caption" color="subtext" className="text-center text-xs">
              Aproveite para organizar seus prontuários e laudos médicos pendentes.
            </Typography>
          </Card>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};
