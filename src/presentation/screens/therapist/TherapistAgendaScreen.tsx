import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Card } from '../../components/molecules/Card';
import { Badge } from '../../components/atoms/Badge';
import { Button } from '../../components/atoms/Button';
import { useThemeStore } from '../../store/useThemeStore';
import { Calendar as CalIcon, Plus, Clock, Lock, ShieldCheck } from 'lucide-react-native';

const DAYS = [
  { label: 'Seg', date: '18', fullDate: '2026-05-18' },
  { label: 'Ter', date: '19', fullDate: '2026-05-19' },
  { label: 'Qua', date: '20', fullDate: '2026-05-20' },
  { label: 'Qui', date: '21', fullDate: '2026-05-21' },
  { label: 'Sex', date: '22', fullDate: '2026-05-22' },
];

const INITIAL_SLOTS = [
  { id: '1', time: '09:00', status: 'available', patient: null },
  { id: '2', time: '10:00', status: 'available', patient: null },
  { id: '3', time: '11:00', status: 'booked', patient: 'Gabriel Vasconcelos' },
  { id: '4', time: '14:00', status: 'available', patient: null },
  { id: '5', time: '15:00', status: 'blocked', patient: null },
  { id: '6', time: '16:00', status: 'available', patient: null },
];

export const TherapistAgendaScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [slots, setSlots] = useState(INITIAL_SLOTS);

  const handleToggleSlot = (slotId: string, currentStatus: string) => {
    let nextStatus = 'available';
    if (currentStatus === 'available') nextStatus = 'blocked';
    else if (currentStatus === 'blocked') nextStatus = 'available';
    else {
      Alert.alert('Horário Reservado', 'Este horário já possui uma consulta confirmada com um paciente e não pode ser bloqueado manualmente.');
      return;
    }

    setSlots(slots.map(s => s.id === slotId ? { ...s, status: nextStatus } : s));
  };

  const handleAddNewSlot = () => {
    Alert.alert('Novo Bloco de Horário', 'Adicionar um novo horário padrão de atendimento para segundas-feiras?', [
      {
        text: 'Adicionar 17:00',
        onPress: () => {
          const newSlot = {
            id: String(slots.length + 1),
            time: '17:00',
            status: 'available',
            patient: null,
          };
          setSlots([...slots, newSlot]);
        }
      },
      { text: 'Cancelar', style: 'cancel' }
    ]);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <View className="px-6 pt-6 flex-1">
        
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Typography variant="h1" className="text-2xl">Minha Agenda</Typography>
          <TouchableOpacity
            onPress={handleAddNewSlot}
            className="w-11 h-11 bg-brand-secondary rounded-2xl items-center justify-center shadow-md shadow-brand-secondary/20"
          >
            <Plus color="white" size={20} />
          </TouchableOpacity>
        </View>

        {/* Escolher Dia */}
        <View className="mb-6 h-18">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DAYS.map((day) => {
              const isSelected = selectedDay.date === day.date;
              return (
                <TouchableOpacity
                  key={day.date}
                  onPress={() => setSelectedDay(day)}
                  className={`w-14 h-16 rounded-2xl items-center justify-center mr-3 border transition-all
                    ${isSelected ? 'bg-brand-secondary border-brand-secondary' : isDark ? 'bg-brand-darkSurface border-slate-800' : 'bg-white border-slate-200'}
                  `}
                >
                  <Typography variant="captionBold" className={`text-xs ${isSelected ? 'text-white' : 'text-brand-lightSubtext'}`}>
                    {day.label}
                  </Typography>
                  <Typography variant="h2" className={`text-lg font-bold mt-1 ${isSelected ? 'text-white' : ''}`}>
                    {day.date}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Listagem de Horários */}
        <Typography variant="h2" className="mb-4">Horários do Dia</Typography>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mb-6">
          <View className="flex-col gap-4">
            {slots.map((slot) => {
              const isBooked = slot.status === 'booked';
              const isBlocked = slot.status === 'blocked';
              
              return (
                <Card
                  key={slot.id}
                  onPress={() => handleToggleSlot(slot.id, slot.status)}
                  className={`flex-row justify-between items-center p-4.5 border-l-4
                    ${isBooked ? 'border-l-brand-success bg-brand-success/5' : isBlocked ? 'border-l-slate-500 bg-slate-500/5 opacity-60' : 'border-l-brand-secondary bg-brand-secondary/5'}
                  `}
                >
                  <View className="flex-row items-center">
                    <Clock color={isBooked ? '#10B981' : isBlocked ? '#94A3B8' : '#4F46E5'} size={20} />
                    <View className="pl-4">
                      <Typography variant="bodyBold" className="text-base">{slot.time}</Typography>
                      <Typography variant="caption" color="subtext" className="mt-0.5">
                        {isBooked ? `Consulta • ${slot.patient}` : isBlocked ? 'Horário Bloqueado' : 'Disponível para Agendamento'}
                      </Typography>
                    </View>
                  </View>

                  <View>
                    {isBooked ? (
                      <Badge label="Reservado" variant="success" />
                    ) : isBlocked ? (
                      <View className="flex-row items-center">
                        <Lock color="#94A3B8" size={14} />
                        <Typography variant="captionBold" color="subtext" className="ml-1 text-xs">Bloqueado</Typography>
                      </View>
                    ) : (
                      <Badge label="Livre" variant="secondary" />
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
};
