import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/molecules/Card';
import { Badge } from '../../components/atoms/Badge';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { PaymentService } from '../../../infrastructure/services/stripe';
import { Wallet, ShieldCheck, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react-native';

export const PatientWalletScreen: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(user?.biometricEnabled || false);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const res = await PaymentService.processMonthlySubscription(user?.id || '', 'card_tok_123');
      if (res.success) {
        setSubscriptionActive(true);
        Alert.alert('Inscrição Confirmada! 💜', 'Parabéns! Sua assinatura MindFlow Premium está ativa. Desfrute de 10% de desconto em todas as suas futuras consultas!');
      }
    } catch {
      Alert.alert('Erro', 'Houve um problema ao processar sua assinatura.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-6">
        
        {/* Header */}
        <Typography variant="h1" className="text-2xl mb-6">Minha Carteira</Typography>

        {/* Card do Saldo / Plano Premium */}
        <Card className="bg-brand-secondary p-6 mb-8 border-transparent shadow-lg shadow-brand-secondary/30 relative overflow-hidden">
          {/* Luz de Gradiente de Fundo do Card */}
          <View className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10" />

          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Typography variant="captionBold" className="text-white/70 uppercase tracking-widest text-[10px]">
                Plano Atual
              </Typography>
              <Typography variant="h2" className="text-white text-2xl font-bold mt-1">
                {subscriptionActive ? 'Premium MindFlow' : 'Plano Gratuito'}
              </Typography>
            </View>
            <Wallet color="white" size={32} />
          </View>

          <View className="border-t border-white/15 pt-5 flex-row justify-between items-center">
            <View>
              <Typography variant="caption" className="text-white/60 text-xs">Desconto em Consultas</Typography>
              <Typography variant="h3" className="text-white font-bold text-lg mt-0.5">
                {subscriptionActive ? '10% de Desconto Ativo' : 'Sem Descontos'}
              </Typography>
            </View>
            
            {!subscriptionActive && (
              <Badge label="Quero Premium" variant="warning" />
            )}
          </View>
        </Card>

        {/* Seção Assinatura Mensal Premium */}
        {!subscriptionActive ? (
          <Card className="mb-8 border-brand-accent/20 bg-brand-accent/5">
            <Typography variant="h3" color="accent" className="mb-2 text-base font-bold">
              Torne-se Assinante Premium
            </Typography>
            <Typography variant="body" color="subtext" className="text-sm leading-6 mb-5 text-justify">
              Por apenas <Typography variant="bodyBold">R$ 29,90/mês</Typography>, garanta benefícios de saúde integrados, lembretes via SMS, 10% de redução no valor de todas as suas sessões e acesso antecipado a laudos clínicos.
            </Typography>

            <Button
              title="Assinar MindFlow Premium"
              onPress={handleSubscribe}
              variant="primary"
              isLoading={isSubscribing}
              className="py-3.5 bg-brand-accent shadow-brand-accent/20"
            />
          </Card>
        ) : (
          <Card className="mb-8 items-center bg-brand-success/5 border-brand-success/15 py-6">
            <CheckCircle2 color="#10B981" size={40} className="mb-3" />
            <Typography variant="bodyBold" color="success">
              Você é um Membro Premium!
            </Typography>
            <Typography variant="caption" color="subtext" className="text-xs mt-1 text-center px-6">
              Assinatura recorrente ativa via cartão de crédito. Próxima cobrança programada para o próximo mês.
            </Typography>
          </Card>
        )}

        {/* Histórico Financeiro */}
        <Typography variant="h2" className="mb-4">Histórico de Transações</Typography>
        <View className="space-y-4 mb-10">
          <Card className="flex-row justify-between items-center p-4">
            <View className="flex-row items-center">
              <View className="w-11 h-11 bg-brand-primary/10 rounded-2xl items-center justify-center mr-3.5">
                <CreditCard color="#0D9488" size={20} />
              </View>
              <View>
                <Typography variant="bodyBold" className="text-sm">Sessão - Dr. Arthur Mendes</Typography>
                <Typography variant="caption" color="subtext" className="text-xs mt-0.5">Cartão • Confirmado</Typography>
              </View>
            </View>
            <Typography variant="bodyBold" color="primary" className="text-sm">- R$ 150,00</Typography>
          </Card>

          <Card className="flex-row justify-between items-center p-4">
            <View className="flex-row items-center">
              <View className="w-11 h-11 bg-brand-primary/10 rounded-2xl items-center justify-center mr-3.5">
                <CreditCard color="#0D9488" size={20} />
              </View>
              <View>
                <Typography variant="bodyBold" className="text-sm">Sessão - Dra. Carla Souza</Typography>
                <Typography variant="caption" color="subtext" className="text-xs mt-0.5">PIX • Confirmado</Typography>
              </View>
            </View>
            <Typography variant="bodyBold" color="primary" className="text-sm">- R$ 180,00</Typography>
          </Card>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
