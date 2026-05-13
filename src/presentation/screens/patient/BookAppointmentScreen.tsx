import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Typography } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/molecules/Card';
import { Avatar } from '../../components/atoms/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useThemeStore } from '../../store/useThemeStore';
import { PaymentService } from '../../../infrastructure/services/stripe';
import { ArrowLeft, Calendar as CalIcon, Clock, CreditCard, Clipboard, CheckCircle2 } from 'lucide-react-native';

const DAYS = [
  { label: 'Seg', date: '18', fullDate: '2026-05-18T00:00:00.000Z' },
  { label: 'Ter', date: '19', fullDate: '2026-05-19T00:00:00.000Z' },
  { label: 'Qua', date: '20', fullDate: '2026-05-20T00:00:00.000Z' },
  { label: 'Qui', date: '21', fullDate: '2026-05-21T00:00:00.000Z' },
  { label: 'Sex', date: '22', fullDate: '2026-05-22T00:00:00.000Z' },
];

const SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export const BookAppointmentScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { therapistId } = route.params;
  const { therapists, bookAppointment } = useAppointmentStore();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const therapist = therapists.find((t) => t.id === therapistId);

  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedSlot, setSelectedSlot] = useState(SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [pixDetails, setPixDetails] = useState<{ qrCode: string; expiration: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!therapist) return null;

  const handleBooking = async () => {
    setIsProcessing(true);
    try {
      // 1. Processar o pagamento simulado
      const paymentRes = await PaymentService.createPaymentIntent(
        therapist.pricePerSession,
        paymentMethod,
        user?.id || ''
      );

      if (paymentMethod === 'pix' && paymentRes.pixQrCode && !pixDetails) {
        setPixDetails({
          qrCode: paymentRes.pixQrCode,
          expiration: paymentRes.pixExpiration || '',
        });
        setIsProcessing(false);
        return;
      }

      // 2. Criar a consulta no banco (mock/store)
      const appointmentTime = `${selectedDay.fullDate.substring(0, 10)}T${selectedSlot}:00.000Z`;
      const bookRes = await bookAppointment(user?.id || '', therapistId, appointmentTime);

      if (bookRes) {
        setIsSuccess(true);
      } else {
        Alert.alert('Erro', 'Não foi possível confirmar seu agendamento.');
      }
    } catch {
      Alert.alert('Erro', 'Falha ao processar pagamento ou agendamento.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPix = () => {
    Alert.alert('Código Copiado!', 'Código PIX Copia e Cola copiado com sucesso para sua área de transferência.');
  };

  if (isSuccess) {
    return (
      <SafeAreaView className="flex-1 bg-brand-darkBg items-center justify-center px-6">
        <View className="items-center">
          <CheckCircle2 color="#0D9488" size={80} className="mb-6" />
          <Typography variant="h1" className="text-white text-3xl font-extrabold mb-3 text-center">
            Sessão Confirmada!
          </Typography>
          <Typography variant="body" color="subtext" className="text-center text-base px-6 mb-8">
            Seu agendamento com o {therapist.user?.fullName} foi registrado no seu calendário e as notificações automáticas de lembrete foram configuradas.
          </Typography>

          <Card className="w-full mb-10">
            <View className="flex-row items-center mb-4">
              <Avatar source={therapist.user?.avatarUrl} size="sm" />
              <View className="flex-1 pl-3">
                <Typography variant="h3" className="text-sm">
                  {therapist.user?.fullName}
                </Typography>
                <Typography variant="caption" color="subtext">
                  {therapist.crp}
                </Typography>
              </View>
            </View>

            <View className="flex-row justify-between border-t border-slate-800 pt-4">
              <View className="flex-row items-center">
                <CalIcon color="#94A3B8" size={16} />
                <Typography variant="captionBold" color="subtext" className="ml-1.5 text-xs">
                  {new Date(selectedDay.fullDate).toLocaleDateString('pt-BR')}
                </Typography>
              </View>
              <View className="flex-row items-center">
                <Clock color="#94A3B8" size={16} />
                <Typography variant="captionBold" color="subtext" className="ml-1.5 text-xs">
                  {selectedSlot} • 50 min
                </Typography>
              </View>
            </View>
          </Card>

          <Button
            title="Voltar ao Início"
            onPress={() => navigation.navigate('PatientTabs')}
            variant="primary"
            className="w-full py-4"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      
      {/* Header */}
      <View className="flex-row items-center px-6 pt-4 mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-slate-800/10 rounded-full mr-4">
          <ArrowLeft color={isDark ? 'white' : 'black'} size={24} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-lg">Agendar Consulta</Typography>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-6">

        {/* Info Psicólogo */}
        <Card className="flex-row items-center p-4 mb-6">
          <Avatar source={therapist.user?.avatarUrl} size="sm" />
          <View className="flex-1 pl-3">
            <Typography variant="h3" className="text-base">{therapist.user?.fullName}</Typography>
            <Typography variant="caption" color="subtext">{therapist.crp}</Typography>
          </View>
        </Card>

        {/* Escolher Dia */}
        <Typography variant="h2" className="mb-4">1. Selecione o Dia</Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 h-18">
          {DAYS.map((day) => {
            const isSelected = selectedDay.date === day.date;
            return (
              <TouchableOpacity
                key={day.date}
                onPress={() => {
                  setSelectedDay(day);
                  setPixDetails(null); // Reseta PIX pendente de outro dia
                }}
                className={`w-14 h-16 rounded-2xl items-center justify-center mr-3 border transition-all
                  ${isSelected ? 'bg-brand-primary border-brand-primary' : isDark ? 'bg-brand-darkSurface border-slate-800' : 'bg-white border-slate-200'}
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

        {/* Escolher Horário */}
        <Typography variant="h2" className="mb-4">2. Selecione o Horário</Typography>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <TouchableOpacity
                key={slot}
                onPress={() => {
                  setSelectedSlot(slot);
                  setPixDetails(null); // Reseta PIX pendente de outro horário
                }}
                className={`px-4 py-3 rounded-2xl border transition-all
                  ${isSelected ? 'bg-brand-primary border-brand-primary' : isDark ? 'bg-brand-darkSurface border-slate-800' : 'bg-white border-slate-200'}
                `}
              >
                <Typography variant="bodyBold" className={`text-sm ${isSelected ? 'text-white' : ''}`}>
                  {slot}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Escolher Método de Pagamento */}
        <Typography variant="h2" className="mb-4">3. Pagamento (R$ {therapist.pricePerSession.toFixed(2)})</Typography>
        <View className="flex-row gap-4 mb-6">
          <TouchableOpacity
            onPress={() => setPaymentMethod('pix')}
            className={`flex-1 flex-row items-center justify-center py-4 border rounded-2xl transition-all
              ${paymentMethod === 'pix' ? 'border-brand-primary bg-brand-primary/10' : isDark ? 'border-slate-800' : 'border-slate-200'}
            `}
          >
            <CalIcon color="#0D9488" size={18} />
            <Typography variant="bodyBold" className="pl-2 text-sm">PIX</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPaymentMethod('credit_card')}
            className={`flex-1 flex-row items-center justify-center py-4 border rounded-2xl transition-all
              ${paymentMethod === 'credit_card' ? 'border-brand-primary bg-brand-primary/10' : isDark ? 'border-slate-800' : 'border-slate-200'}
            `}
          >
            <CreditCard color="#0D9488" size={18} />
            <Typography variant="bodyBold" className="pl-2 text-sm">Cartão</Typography>
          </TouchableOpacity>
        </View>

        {/* Área Informativa do PIX se gerado */}
        {pixDetails && (
          <Card className="mb-8 items-center bg-brand-primary/5 border-brand-primary/15 p-5">
            <Typography variant="captionBold" color="primary" className="mb-2 text-center uppercase tracking-wider">
              PIX Gerado com Sucesso!
            </Typography>
            <Typography variant="caption" color="subtext" className="text-center text-xs leading-5 mb-4 px-4">
              Copie o código abaixo e efetue o pagamento no aplicativo do seu banco para confirmar a consulta de forma instantânea.
            </Typography>
            
            <TouchableOpacity
              onPress={handleCopyPix}
              className="w-full bg-brand-darkBg border border-slate-800 flex-row items-center justify-between p-3.5 rounded-2xl"
            >
              <Typography variant="caption" color="subtext" numberOfLines={1} className="flex-1 mr-4">
                {pixDetails.qrCode}
              </Typography>
              <Clipboard color="#0D9488" size={18} />
            </TouchableOpacity>
          </Card>
        )}

      </ScrollView>

      {/* Botão de Finalização Fixo Inferior */}
      <View className="p-6 border-t border-slate-100 dark:border-slate-800">
        <Button
          title={pixDetails ? 'Confirmar Meu Pagamento' : 'Prosseguir para Pagamento'}
          onPress={handleBooking}
          variant="primary"
          isLoading={isProcessing}
          className="w-full py-4"
        />
      </View>

    </SafeAreaView>
  );
};
