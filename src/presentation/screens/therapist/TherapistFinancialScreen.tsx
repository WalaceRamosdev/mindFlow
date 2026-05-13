import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Card } from '../../components/molecules/Card';
import { Badge } from '../../components/atoms/Badge';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  CreditCard, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Landmark, 
  ShieldCheck, 
  ArrowUpRight, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  DollarSign 
} from 'lucide-react-native';

export const TherapistFinancialScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const totalRevenue = 4250.00;
  const pendingPayout = 1250.00;

  const handleDownloadInvoice = (id: string) => {
    Alert.alert('Download de Recibo', `Exportando o arquivo PDF de recibo de transação fiscal referente ao ID ${id}. O documento será gerado e assinado digitalmente com seu CRP.`);
  };

  const handleWithdrawPress = () => {
    Alert.alert('Solicitação de Saque', `Seu saldo de R$ ${pendingPayout.toFixed(2)} está configurado para transferência automática na sexta-feira. Caso queira antecipar, taxas adicionais de repasse instantâneo via PIX podem se aplicar.`);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 50, alignItems: 'center' }}
      >
        <View className="flex-col gap-8 w-full max-w-[420px] items-stretch">
          
          {/* Top Header Section Centrado */}
          <View className="items-center justify-center">
            <Typography variant="caption" color="subtext" className="text-sm uppercase tracking-wider font-semibold text-center">
              Painel Geral
            </Typography>
            <Typography variant="h1" className="text-3xl font-extrabold mt-1 text-center">
              Olá, Dr(a). {user?.name?.split(' ')[0] || 'Profissional'}
            </Typography>
            
            {/* Seletor de Período Premium Centrado */}
            <TouchableOpacity 
              activeOpacity={0.7}
              className={`flex-row items-center px-4 py-2.5 mt-3.5 rounded-xl border ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'
              }`}
            >
              <Calendar color={isDark ? '#64748B' : '#94A3B8'} size={16} />
              <Typography variant="captionBold" className="ml-2 text-sm text-center">
                Maio, 2026
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Hero Section: O CARD DE SALDO ABSOLUTAMENTE PREMIUM FLAT (Sem elevação ou brilhos de fundo) */}
          <Card 
            elevation={0}
            className={`p-6 mt-4 border-0 relative overflow-hidden ${
              isDark ? 'bg-slate-900/40 border border-slate-800' : 'bg-slate-50 border border-slate-150'
            }`}
          >
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-emerald-500 mr-2.5" />
                <Typography variant="caption" color="subtext" className="text-sm font-semibold tracking-wide">
                  Saldo disponível para repasse
                </Typography>
              </View>
              <ShieldCheck color="#10B981" size={20} />
            </View>

            <Typography variant="h1" className="text-[42px] font-extrabold tracking-tight mb-2">
              R$ {pendingPayout.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>

            <View className="flex-row items-center mb-6">
              <Typography variant="caption" color="subtext" className="text-sm">
                Transferência automática agendada para sexta-feira (22/05)
              </Typography>
            </View>

            {/* CTA Buttons in Hero Card */}
            <View className="flex-row gap-4">
              <TouchableOpacity 
                onPress={handleWithdrawPress}
                activeOpacity={0.8}
                className="flex-1 bg-brand-primary py-3.5 rounded-2xl items-center justify-center"
              >
                <Typography variant="bodyBold" className="text-white text-[15px]">
                  Antecipar Repasse
                </Typography>
              </TouchableOpacity>
              
              <View className={`px-5 rounded-2xl items-center justify-center border ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-150'
              }`}>
                <Landmark color={isDark ? '#64748B' : '#94A3B8'} size={20} />
              </View>
            </View>
          </Card>

          {/* Resumo Rápido em Linha (Grid Minimalista) */}
          <View className="flex-row gap-5">
            <View className={`flex-1 p-5 rounded-2xl border ${
              isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-slate-50/50 border-slate-150'
            }`}>
              <Typography variant="caption" color="subtext" className="text-xs font-semibold">
                Faturado no Mês
              </Typography>
              <Typography variant="h3" className="text-[20px] font-bold mt-1.5">
                R$ {totalRevenue.toFixed(2)}
              </Typography>
              <View className="flex-row items-center mt-2">
                <TrendingUp color="#10B981" size={14} />
                <Typography variant="captionBold" color="success" className="text-xs ml-1">
                  +15.3% este mês
                </Typography>
              </View>
            </View>

            <View className={`flex-1 p-5 rounded-2xl border ${
              isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-slate-50/50 border-slate-150'
            }`}>
              <Typography variant="caption" color="subtext" className="text-xs font-semibold">
                Sessões Concluídas
              </Typography>
              <Typography variant="h3" className="text-[20px] font-bold mt-1.5">
                28 consultas
              </Typography>
              <View className="flex-row items-center mt-2">
                <CheckCircle2 color="#10B981" size={14} />
                <Typography variant="captionBold" color="success" className="text-xs ml-1">
                  96.5% Presença
                </Typography>
              </View>
            </View>
          </View>

          {/* Desempenho & Metas */}
          <View className="flex-col gap-3.5">
            <Typography variant="h2" className="text-xl font-bold text-center">
              Meta de Faturamento
            </Typography>
            
            <Card elevation={0} className="p-5">
              <View className="flex-row justify-between items-center mb-3">
                <Typography variant="caption" color="subtext" className="text-sm font-semibold">
                  Meta Mensal de R$ 5.000,00
                </Typography>
                <Typography variant="captionBold" color="primary" className="text-xs bg-brand-primary/10 px-2.5 py-1 rounded-md">
                  85% Atingido
                </Typography>
              </View>
              
              {/* Gorgeous Thick Progress Bar */}
              <View className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <View className="h-full bg-brand-primary rounded-full w-[85%]" />
              </View>
              
              <View className="flex-row justify-between mt-2.5">
                <Typography variant="caption" color="subtext" className="text-xs font-semibold text-brand-primary">
                  Falta apenas R$ 750,00 para atingir sua meta!
                </Typography>
              </View>
            </Card>
          </View>

          {/* Últimas Transações e Emissão de Recibo */}
          <View className="flex-col gap-4">
            <View className="items-center">
              <Typography variant="h2" className="text-xl font-bold text-center">
                Recebimentos Recentes
              </Typography>
              <TouchableOpacity activeOpacity={0.7} className="mt-1.5">
                <Typography variant="captionBold" color="secondary" className="text-sm text-center">
                  Ver Todos os Lançamentos
                </Typography>
              </TouchableOpacity>
            </View>

            {/* Unified sleek feed container card */}
            <Card elevation={0} className="p-0 overflow-hidden">
              {/* Transação 1 */}
              <View className="flex-row justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800/80">
                <View className="flex-row items-center flex-1">
                  <View className={`w-11 h-11 rounded-full items-center justify-center mr-4 ${
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  }`}>
                    <CreditCard color="#0D9488" size={20} />
                  </View>
                  <View className="flex-1">
                    <Typography variant="bodyBold" className="text-[16px]">
                      Gabriel Vasconcelos
                    </Typography>
                    <Typography variant="caption" color="subtext" className="text-xs mt-0.5">
                      12/05/2026 • Cartão de Crédito
                    </Typography>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Typography variant="bodyBold" color="success" className="text-base mr-3.5 font-bold">
                    + R$ 150,00
                  </Typography>
                  <TouchableOpacity 
                    onPress={() => handleDownloadInvoice('tr_9485')} 
                    activeOpacity={0.7}
                    className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-150'
                    }`}
                  >
                    <Download color={isDark ? '#94A3B8' : '#64748B'} size={16} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Transação 2 */}
              <View className="flex-row justify-between items-center p-5">
                <View className="flex-row items-center flex-1">
                  <View className={`w-11 h-11 rounded-full items-center justify-center mr-4 ${
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  }`}>
                    <DollarSign color="#10B981" size={20} />
                  </View>
                  <View className="flex-1">
                    <Typography variant="bodyBold" className="text-[16px]">
                      Mariana Azevedo
                    </Typography>
                    <Typography variant="caption" color="subtext" className="text-xs mt-0.5">
                      10/05/2026 • Transferência PIX
                    </Typography>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Typography variant="bodyBold" color="success" className="text-base mr-3.5 font-bold">
                    + R$ 180,00
                  </Typography>
                  <TouchableOpacity 
                    onPress={() => handleDownloadInvoice('tr_1195')} 
                    activeOpacity={0.7}
                    className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-150'
                    }`}
                  >
                    <Download color={isDark ? '#94A3B8' : '#64748B'} size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </View>

          {/* Selo de Segurança de Ponta a Ponta */}
          <View className={`p-5 rounded-2xl border flex-row items-start ${
            isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50/40 border-emerald-500/10'
          }`}>
            <ShieldCheck color="#10B981" size={24} className="mt-0.5" />
            <View className="flex-1 pl-4">
              <Typography variant="bodyBold" color="success" className="text-sm">
                Conexão e Repasses Criptografados
              </Typography>
              <Typography variant="caption" color="subtext" className="text-xs mt-1.5 leading-5">
                Seus repasses são processados via Gateway de pagamento homologado nível 1 (PCI-DSS), com transferência garantida de 100% dos seus honorários médicos de forma blindada e com liquidação automática garantida.
              </Typography>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
