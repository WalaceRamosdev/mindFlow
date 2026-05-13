import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/molecules/Card';
import { Badge } from '../../components/atoms/Badge';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { PaymentService } from '../../../infrastructure/services/stripe';
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  FileCheck, 
  Copy, 
  Check, 
  Star,
  Receipt,
  HeartHandshake
} from 'lucide-react-native';

export const PatientWalletScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const res = await PaymentService.processMonthlySubscription(user?.id || '', 'card_tok_123');
      if (res.success) {
        setSubscriptionActive(true);
        Alert.alert(
          'Inscrição Confirmada! 💜', 
          'Parabéns! Sua assinatura MindFlow Premium está ativa. Desfrute de 10% de desconto em todas as suas futuras consultas!'
        );
      }
    } catch {
      Alert.alert('Erro', 'Houve um problema ao processar sua assinatura.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCopyCoupon = () => {
    setCopiedCode(true);
    Alert.alert('Cupom Copiado! 🎟️', 'Código "AMIGO20" copiado para a área de transferência.');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRequestReceipt = () => {
    Alert.alert(
      'Emitir Recibo de Reembolso', 
      'Deseja gerar o recibo consolidado das consultas de Maio de 2026 para solicitar reembolso no seu plano de saúde (Unimed, SulAmérica, Bradesco, etc.)?',
      [
        { text: 'Gerar PDF', onPress: () => Alert.alert('Recibo Gerado! 📄', 'O documento PDF contendo o CRP dos profissionais e o registro das consultas foi baixado com sucesso.') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 50 }}
      >
        <View className="flex-col gap-8 w-full items-stretch">
          
          {/* Header Carteira Centrado */}
          <View className="items-center justify-center">
            <View className="w-14 h-14 bg-brand-primary/10 rounded-3xl items-center justify-center mb-3">
              <Wallet color="#0D9488" size={28} />
            </View>
            <Typography variant="h1" className="text-2xl font-extrabold text-center">Minha Carteira</Typography>
            <Typography variant="caption" color="subtext" className="text-xs text-center mt-1">
              Gerencie seus pagamentos, descontos e reembolsos de saúde
            </Typography>
          </View>

          {/* Card Premium de Saldo / Plano Atual */}
          <Card elevation={0} className="bg-brand-secondary p-6 border-transparent relative overflow-hidden rounded-3xl">
            {/* Esferas decorativas de fundo premium */}
            <View className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10" />
            <View className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-white/5" />

            <View className="flex-row justify-between items-start mb-6 z-10">
              <View>
                <Typography variant="captionBold" className="text-white/60 uppercase tracking-widest text-[10px]">
                  Assinatura de Benefícios
                </Typography>
                <Typography variant="h2" className="text-white text-2xl font-black mt-1">
                  {subscriptionActive ? 'MindFlow Premium' : 'Plano Gratuito'}
                </Typography>
              </View>
              <View className="p-2">
                <FileCheck color="white" size={24} />
              </View>
            </View>

            <View className="border-t border-white/15 pt-5 flex-row justify-between items-center z-10">
              <View>
                <Typography variant="caption" className="text-white/60 text-xs">Vantagem em Consultas</Typography>
                <Typography variant="h3" className="text-white font-black text-lg mt-0.5">
                  {subscriptionActive ? '10% OFF em todas as sessões' : 'Sem descontos ativos'}
                </Typography>
              </View>
              
              {!subscriptionActive && (
                <View className="bg-amber-400/20 px-3 py-1.5 rounded-full border border-amber-400/30">
                  <Typography variant="captionBold" className="text-amber-300 text-[10px] uppercase font-bold tracking-wider">
                    Upgrade Disponível
                  </Typography>
                </View>
              )}
            </View>
          </Card>

          {/* Banner de Assinatura Premium Promocional */}
          {!subscriptionActive ? (
            <Card elevation={0} className="border-brand-accent/20 bg-brand-accent/5 p-6 flex-col rounded-3xl">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-brand-accent/15 p-1.5 rounded-lg">
                  <Star color="#4F46E5" size={16} fill="#4F46E5" />
                </View>
                <Typography variant="h3" color="accent" className="text-base font-bold">
                  Assine o MindFlow Premium
                </Typography>
              </View>
              
              <Typography variant="body" color="subtext" className="text-sm leading-6 mb-5 text-justify">
                Por apenas <Typography variant="bodyBold">R$ 29,90/mês</Typography>, reduza o valor de todas as suas sessões de terapia em 10%, tenha prioridade na agenda médica e garanta lembretes automáticos via SMS/WhatsApp.
              </Typography>

              <Button
                title="Assinar Agora • R$ 29,90/mês"
                onPress={handleSubscribe}
                variant="primary"
                isLoading={isSubscribing}
                className="py-3.5 bg-brand-accent shadow-brand-accent/20 rounded-2xl w-full"
              />
            </Card>
          ) : (
            <Card elevation={0} className="items-center bg-emerald-500/5 border-emerald-500/15 py-6 px-6 rounded-3xl">
              <View className="w-12 h-12 bg-emerald-500/10 rounded-full items-center justify-center mb-3">
                <Check color="#10B981" size={24} />
              </View>
              <Typography variant="bodyBold" color="success" className="text-base font-bold">
                Você é um Membro Premium!
              </Typography>
              <Typography variant="caption" color="subtext" className="text-xs mt-1 text-center leading-5 px-3">
                Assinatura ativa. Os 10% de desconto já estão sendo deduzidos em qualquer nova sessão que você agendar!
              </Typography>
            </Card>
          )}

          {/* Seção 1: Métodos de Pagamento */}
          <View className="flex-col gap-3.5">
            <Typography variant="h2" className="text-lg font-bold text-center">Cartões Cadastrados</Typography>
            
            {/* Lista de Cartões */}
            <View className="flex-col gap-3">
              <Card elevation={0} className={`flex-row justify-between items-center p-4 border ${
                isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-150 bg-slate-50/20'
              }`}>
                <View className="flex-row items-center">
                  <View className="w-12 h-8 bg-slate-900 rounded-lg items-center justify-center mr-3.5 shadow-sm">
                    <Typography className="text-white text-[10px] font-black">MC</Typography>
                  </View>
                  <View>
                    <Typography variant="bodyBold" className="text-sm">MasterCard •••• 4242</Typography>
                    <Typography variant="caption" color="subtext" className="text-xs mt-0.5">Expiração: 09/31 • Cartão Principal</Typography>
                  </View>
                </View>
                <Badge label="Principal" variant="success" />
              </Card>

              {/* Adicionar Cartão com Design Tracejado */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => Alert.alert('Novo Cartão', 'Redirecionando para o fluxo de checkout criptografado e seguro do Stripe...')}
                className={`border border-dashed py-4 rounded-2xl flex-row items-center justify-center gap-2 ${
                  isDark ? 'border-slate-800 bg-slate-900/5' : 'border-slate-200 bg-slate-50/10'
                }`}
              >
                <Plus color="#0D9488" size={16} />
                <Typography variant="bodyBold" color="primary" className="text-sm">
                  Adicionar Novo Cartão
                </Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Seção 2: Reembolso de Convênio Médico (Diferencial Versátil) */}
          <View className="flex-col gap-3.5">
            <Typography variant="h2" className="text-lg font-bold text-center">Reembolso de Plano de Saúde</Typography>
            <Card elevation={0} className={`p-5 border ${
              isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-150 bg-slate-50/20'
            }`}>
              <View className="flex-row items-center gap-2.5 mb-2.5">
                <View className="bg-brand-primary/10 p-1.5 rounded-lg">
                  <Receipt color="#0D9488" size={16} />
                </View>
                <Typography variant="h3" className="text-base font-bold">Solicitar Recibo para Convênio</Typography>
              </View>
              
              <Typography variant="body" color="subtext" className="text-sm leading-6 mb-4 text-justify">
                Sabia que a maioria dos planos de saúde (Bradesco, SulAmérica, Amil, Unimed, etc.) oferece reembolso para sessões de psicologia? Baixe os comprovantes fiscais completos com CRP do terapeuta.
              </Typography>

              <TouchableOpacity
                onPress={handleRequestReceipt}
                activeOpacity={0.8}
                className="bg-brand-primary/10 border border-brand-primary/20 py-3.5 rounded-2xl items-center justify-center w-full"
              >
                <Typography variant="bodyBold" color="primary" className="text-sm">
                  Solicitar Recibo (PDF)
                </Typography>
              </TouchableOpacity>
            </Card>
          </View>

          {/* Seção 3: Programa de Indicação (Cupom) */}
          <View className="flex-col gap-3.5">
            <Typography variant="h2" className="text-lg font-bold text-center">Ganhe Créditos de Desconto</Typography>
            <Card elevation={0} className={`p-5 border ${
              isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-150 bg-slate-50/20'
            }`}>
              <View className="flex-row items-center gap-2.5 mb-2.5">
                <View className="bg-brand-primary/10 p-1.5 rounded-lg">
                  <HeartHandshake color="#0D9488" size={16} />
                </View>
                <Typography variant="h3" className="text-base font-bold">Indique e Ganhe R$ 20,00</Typography>
              </View>

              <Typography variant="body" color="subtext" className="text-sm leading-6 mb-4 text-justify">
                Compartilhe o seu link de convite! Seu amigo ganha <Typography variant="bodyBold">R$ 20,00</Typography> de desconto na primeira sessão de terapia dele, e você ganha outros <Typography variant="bodyBold">R$ 20,00</Typography> logo depois!
              </Typography>

              <View className={`flex-row items-center justify-between p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-100/50 border-slate-150'
              }`}>
                <Typography variant="bodyBold" className="text-sm select-all">AMIGO20</Typography>
                <TouchableOpacity onPress={handleCopyCoupon} className="p-1">
                  {copiedCode ? <Check color="#10B981" size={18} /> : <Copy color="#94A3B8" size={18} />}
                </TouchableOpacity>
              </View>
            </Card>
          </View>

          {/* Seção 4: Histórico de Transações */}
          <View className="flex-col gap-3.5">
            <Typography variant="h2" className="text-lg font-bold text-center">Histórico de Transações</Typography>
            
            <View className="flex-col gap-3">
              <Card elevation={0} className={`flex-row justify-between items-center p-4 border ${
                isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-150 bg-slate-50/20'
              }`}>
                <View className="flex-row items-center">
                  <View className="w-11 h-11 bg-brand-primary/10 rounded-2xl items-center justify-center mr-3.5">
                    <CreditCard color="#0D9488" size={20} />
                  </View>
                  <View>
                    <Typography variant="bodyBold" className="text-sm">Consulta - Dr. Arthur Mendes</Typography>
                    <Typography variant="caption" color="subtext" className="text-xs mt-0.5">MasterCard • 12/05/2026 • 15:30</Typography>
                  </View>
                </View>
                <Typography variant="bodyBold" color="primary" className="text-sm">- R$ 150,00</Typography>
              </Card>

              <Card elevation={0} className={`flex-row justify-between items-center p-4 border ${
                isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-150 bg-slate-50/20'
              }`}>
                <View className="flex-row items-center">
                  <View className="w-11 h-11 bg-brand-primary/10 rounded-2xl items-center justify-center mr-3.5">
                    <CreditCard color="#0D9488" size={20} />
                  </View>
                  <View>
                    <Typography variant="bodyBold" className="text-sm">Consulta - Dra. Carla Souza</Typography>
                    <Typography variant="caption" color="subtext" className="text-xs mt-0.5">Pix • 03/05/2026 • 10:00</Typography>
                  </View>
                </View>
                <Typography variant="bodyBold" color="primary" className="text-sm">- R$ 180,00</Typography>
              </Card>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
