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
        <View className="mb-6">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {DAYS.map((day) => {
              const isSelected = selectedDay.date === day.date;
              return (
                <TouchableOpacity
                  key={day.date}
                  onPress={() => setSelectedDay(day)}
                  className={`w-14 h-16 rounded-2xl items-center justify-center border transition-all
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
          </View>
        </View>

        {/* Listagem de Horários */}
        <Typography variant="h2" className="mb-4">Horários do Dia</Typography>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mb-6">
          <View className="flex-col gap-4">
            {slots.map((slot) => {
              const isBooked = slot.status === 'booked';
              const isBlocked = slot.status === 'blocked';
              
              return (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => handleToggleSlot(slot.id, slot.status)}
                  activeOpacity={0.7}
                  className={`flex-row justify-between items-center py-3 px-5 rounded-2xl border transition-all
                    ${isBooked ? (isDark ? 'bg-brand-success/5 border-brand-success/20' : 'bg-brand-success/5 border-brand-success/15') :
                      isBlocked ? (isDark ? 'bg-slate-900/40 border-slate-900/40 opacity-50' : 'bg-slate-50 border-slate-100 opacity-60') :
                      (isDark ? 'bg-brand-darkSurface border-slate-800/80' : 'bg-white border-slate-200/60')
                    }
                  `}
                >
                  <View className="flex-row items-center flex-1">
                    {/* Coluna Horário */}
                    <View className="w-14">
                      <Typography variant="bodyBold" className={`text-base ${isBooked ? 'text-brand-success' : isBlocked ? 'text-slate-400' : 'text-brand-secondary'}`}>
                        {slot.time}
                      </Typography>
                    </View>
 
                    {/* Barra de Status Indicadora */}
                    <View className="mr-4">
                      <View className={`w-1 h-5 rounded-full
                        ${isBooked ? 'bg-brand-success' : isBlocked ? 'bg-slate-400' : 'bg-brand-secondary'}
                      `} />
                    </View>
 
                    {/* Detalhes */}
                    <View className="flex-1">
                      <Typography variant="bodyBold" className={`text-[14px] ${isBlocked ? 'text-slate-400 font-normal' : ''}`}>
                        {isBooked ? slot.patient : isBlocked ? 'Horário Bloqueado' : 'Horário Livre'}
                      </Typography>
                      <Typography variant="caption" color="subtext" className="text-[11px] mt-0.5">
                        {isBooked ? 'Consulta por vídeo' : isBlocked ? 'Bloqueado para agendamentos' : 'Disponível para agenda'}
                      </Typography>
                    </View>
                  </View>
 
                  <View className="pl-4">
                    {isBooked ? (
                      <ShieldCheck color="#10B981" size={18} />
                    ) : isBlocked ? (
                      <Lock color="#94A3B8" size={15} />
                    ) : (
                      <Plus color="#4F46E5" size={16} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
};
