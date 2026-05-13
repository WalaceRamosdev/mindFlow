import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Typography } from '../../components/atoms/Typography';
import { Card } from '../../components/molecules/Card';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldAlert, Users, CreditCard, CheckCircle2, XCircle, LogOut } from 'lucide-react-native';

const PENDING_DOCTORS = [
  { id: 'usr_doc_pending_01', name: 'Dr. Fernando Reis', crp: 'CRP 06/987541', specialty: 'Neuropsicologia', experience: '10 anos', requestDate: '12/05/2026' },
  { id: 'usr_doc_pending_02', name: 'Dra. Luana Prado', crp: 'CRP 06/119853', specialty: 'TCC / Burnout', experience: '5 anos', requestDate: '11/05/2026' },
];

export const AdminDashboardScreen: React.FC = () => {
  const { logout } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [pendingDocs, setPendingDocs] = useState(PENDING_DOCTORS);

  const handleApprove = (docId: string, docName: string) => {
    Alert.alert(
      'Aprovar Profissional?',
      `Confirmar que o registro de CRP do ${docName} foi validado no Conselho Regional de Psicologia e habilitar o perfil público no app?`,
      [
        {
          text: 'Aprovar e Ativar',
          onPress: () => {
            setPendingDocs(pendingDocs.filter(d => d.id !== docId));
            Alert.alert('Sucesso!', 'Perfil profissional aprovado e ativado com sucesso. Um e-mail de notificação foi enviado.');
          }
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleReject = (docId: string, docName: string) => {
    Alert.alert(
      'Rejeitar Cadastro?',
      `Deseja realmente rejeitar a solicitação de credenciamento do ${docName}?`,
      [
        {
          text: 'Rejeitar',
          style: 'destructive',
          onPress: () => {
            setPendingDocs(pendingDocs.filter(d => d.id !== docId));
            Alert.alert('Registro Rejeitado', 'Cadastro descartado com sucesso.');
          }
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <View className="px-6 pt-6 flex-1">
        
        {/* Header Admin */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Typography variant="body" color="subtext" className="text-sm">Painel Central Administrativo</Typography>
            <Typography variant="h1" className="text-2xl mt-0.5">MindFlow Admin 🛡️</Typography>
          </View>
          <TouchableOpacity
            onPress={logout}
            className="w-11 h-11 bg-brand-danger/10 rounded-2xl items-center justify-center border border-brand-danger/20"
          >
            <LogOut color="#EF4444" size={20} />
          </TouchableOpacity>
        </View>

        {/* Linha de Métricas Globais */}
        <View className="flex-row gap-4 mb-8">
          <Card className="flex-1 p-4">
            <Users color="#0D9488" size={20} />
            <Typography variant="caption" color="subtext" className="text-xs mt-3">Usuários Cadastrados</Typography>
            <Typography variant="h2" className="font-bold text-lg mt-0.5">142</Typography>
          </Card>

          <Card className="flex-1 p-4">
            <CreditCard color="#4F46E5" size={20} />
            <Typography variant="caption" color="subtext" className="text-xs mt-3">Receita Transacionada</Typography>
            <Typography variant="h2" className="font-bold text-lg mt-0.5">R$ 18.450</Typography>
          </Card>
        </View>

        {/* Solicitações de Credenciamento Pendentes */}
        <Typography variant="h2" className="mb-4">Pendentes de Aprovação (CRP)</Typography>

        {pendingDocs.length > 0 ? (
          <FlatList
            data={pendingDocs}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Card className="mb-4 p-4.5">
                <View className="flex-row items-center mb-3">
                  <Avatar source={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=8B5CF6&color=fff`} size="sm" />
                  <View className="pl-3.5 flex-1">
                    <Typography variant="h3" className="text-base">{item.name}</Typography>
                    <Typography variant="caption" color="subtext" className="text-xs mt-0.5">{item.crp} • {item.specialty}</Typography>
                  </View>
                </View>

                <View className="flex-row justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-1.5">
                  <Typography variant="caption" color="subtext">Solicitado em: {item.requestDate}</Typography>
                  
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleReject(item.id, item.name)}
                      className="px-3 py-2 bg-brand-danger/10 rounded-xl flex-row items-center border border-brand-danger/10"
                    >
                      <XCircle color="#EF4444" size={14} />
                      <Typography variant="captionBold" color="danger" className="pl-1.5 text-xs">Rejeitar</Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleApprove(item.id, item.name)}
                      className="px-3 py-2 bg-brand-primary/10 rounded-xl flex-row items-center border border-brand-primary/10"
                    >
                      <CheckCircle2 color="#0D9488" size={14} />
                      <Typography variant="captionBold" color="primary" className="pl-1.5 text-xs">Aprovar</Typography>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            )}
          />
        ) : (
          <Card className="items-center py-10">
            <Typography variant="body" color="subtext" className="text-center mb-2">Sem solicitações pendentes</Typography>
            <Typography variant="caption" color="subtext" className="text-center text-xs px-6">Todos os cadastros profissionais recebidos foram analisados e estão devidamente atualizados.</Typography>
          </Card>
        )}

      </View>
    </SafeAreaView>
  );
};
