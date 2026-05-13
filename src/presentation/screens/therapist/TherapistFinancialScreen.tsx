import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Card } from '../../components/molecules/Card';
import { Badge } from '../../components/atoms/Badge';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CreditCard, ArrowRight, Download, BarChart3, TrendingUp, Landmark } from 'lucide-react-native';

export const TherapistFinancialScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const totalRevenue = 4250.00;
  const pendingPayout = 1250.00;

  const handleDownloadInvoice = (id: string) => {
    Alert.alert('Download de Recibo', `Exportando o arquivo PDF de recibo de transação fiscal referente ao ID ${id}. O documento será gerado e assinado digitalmente com seu CRP.`);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-6">
        
        {/* Header */}
        <Typography variant="h1" className="text-2xl mb-6">Controle Financeiro</Typography>

        {/* Saldo a Receber */}
        <Card className="bg-brand-secondary p-6 mb-8 border-transparent shadow-lg shadow-brand-secondary/30 relative overflow-hidden">
          {/* Luz de Gradiente de Fundo do Card */}
          <View className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10" />

          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Typography variant="captionBold" className="text-white/70 uppercase tracking-widest text-[10px]">
                Saldo Próxima Liquidação
              </Typography>
              <Typography variant="h2" className="text-white text-3xl font-bold mt-1">
                R$ {pendingPayout.toFixed(2)}
              </Typography>
            </View>
            <Landmark color="white" size={32} />
          </View>

          <View className="border-t border-white/15 pt-5 flex-row justify-between items-center">
            <View>
              <Typography variant="caption" className="text-white/60 text-xs">Total Recebido no Mês</Typography>
              <Typography variant="h3" className="text-white font-bold text-lg mt-0.5">
                R$ {totalRevenue.toFixed(2)}
              </Typography>
            </View>
            <Badge label="+ 15% Crescimento" variant="success" />
          </View>
        </Card>

        {/* Estatísticas Clínicas */}
        <Typography variant="h2" className="mb-4">Estatísticas Clínicas</Typography>
        <Card className="mb-8 p-5">
          <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-slate-150 dark:border-slate-800">
            <View className="flex-row items-center">
              <BarChart3 color="#4F46E5" size={20} />
              <Typography variant="bodyBold" className="pl-3 text-sm">Sessões Realizadas no Mês</Typography>
            </View>
            <Typography variant="bodyBold" className="text-sm">28 sessões</Typography>
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <TrendingUp color="#10B981" size={20} />
              <Typography variant="bodyBold" className="pl-3 text-sm">Taxa de Presença (No-Show)</Typography>
            </View>
            <Typography variant="bodyBold" color="success" className="text-sm">96.5%</Typography>
          </View>
        </Card>

        {/* Últimas Transações e Emissão de Recibo */}
        <Typography variant="h2" className="mb-4">Recebimentos e Recibos</Typography>
        <View className="flex-col gap-4 mb-10">
          
          <Card className="flex-row justify-between items-center p-4">
            <View className="flex-row items-center">
              <View className="w-11 h-11 bg-brand-primary/10 rounded-2xl items-center justify-center mr-3.5">
                <CreditCard color="#0D9488" size={20} />
              </View>
              <View>
                <Typography variant="bodyBold" className="text-sm">Gabriel Vasconcelos</Typography>
                <Typography variant="caption" color="subtext" className="text-xs mt-0.5">12/05/2026 • Crédito</Typography>
              </View>
            </View>
            <View className="flex-row items-center">
              <Typography variant="bodyBold" color="success" className="text-sm mr-3">+ R$ 150,00</Typography>
              <TouchableOpacity onPress={() => handleDownloadInvoice('tr_9485')} className="p-2 bg-slate-800/10 rounded-xl">
                <Download color={isDark ? 'white' : 'black'} size={16} />
              </TouchableOpacity>
            </View>
          </Card>

          <Card className="flex-row justify-between items-center p-4">
            <View className="flex-row items-center">
              <View className="w-11 h-11 bg-brand-primary/10 rounded-2xl items-center justify-center mr-3.5">
                <CreditCard color="#0D9488" size={20} />
              </View>
              <View>
                <Typography variant="bodyBold" className="text-sm">Mariana Azevedo</Typography>
                <Typography variant="caption" color="subtext" className="text-xs mt-0.5">10/05/2026 • PIX</Typography>
              </View>
            </View>
            <View className="flex-row items-center">
              <Typography variant="bodyBold" color="success" className="text-sm mr-3">+ R$ 180,00</Typography>
              <TouchableOpacity onPress={() => handleDownloadInvoice('tr_1195')} className="p-2 bg-slate-800/10 rounded-xl">
                <Download color={isDark ? 'white' : 'black'} size={16} />
              </TouchableOpacity>
            </View>
          </Card>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
