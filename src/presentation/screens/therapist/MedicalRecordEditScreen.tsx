import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Card } from '../../components/molecules/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Badge } from '../../components/atoms/Badge';
import { useAuthStore } from '../../store/useAuthStore';
import { useFinancialStore } from '../../store/useFinancialStore';
import { useThemeStore } from '../../store/useThemeStore';
import { ArrowLeft, ShieldAlert, FileSignature, CheckCircle2, Award } from 'lucide-react-native';

export const MedicalRecordEditScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { appointmentId, patientId, patientName } = route.params;

  const { user } = useAuthStore();
  const { medicalRecords, addMedicalRecord, signDocument } = useFinancialStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [evolutionText, setEvolutionText] = useState('');
  const [diagnosisCode, setDiagnosisCode] = useState('F41.1'); // CID-10 padrão (Ansiedade)
  const [privateNotes, setPrivateNotes] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [signatureHash, setSignatureHash] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  // Busca se já existe um prontuário cadastrado para o paciente
  const patientHistory = medicalRecords[patientId] || [];

  const handleSaveAndSign = async () => {
    if (!evolutionText.trim()) {
      Alert.alert('Erro', 'O texto de evolução clínica do paciente é obrigatório.');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Salva a evolução no histórico clínico (mock/store)
      await addMedicalRecord(
        appointmentId || `apt_${Math.random().toString(36).substring(2, 9)}`,
        patientId,
        user?.id || '',
        evolutionText,
        diagnosisCode,
        privateNotes
      );

      // Simula a geração da assinatura digital criptográfica
      const generatedHash = `sha256:sig_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
      setSignatureHash(generatedHash);
      setIsSigned(true);

      Alert.alert('Documento Assinado! 📜', `Prontuário salvo e assinado digitalmente com sucesso em conformidade com o CFM e a LGPD.\n\nHash da Assinatura:\n${generatedHash.substring(0, 32)}...`);
    } catch {
      Alert.alert('Erro', 'Houve um problema ao salvar o prontuário.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      
      {/* Header */}
      <View className="flex-row items-center px-6 pt-4 mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-slate-800/10 rounded-full mr-4">
          <ArrowLeft color={isDark ? 'white' : 'black'} size={24} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-lg">Prontuário Clínico</Typography>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-6 flex-1">
        
        {/* Paciente */}
        <Card className="p-4 mb-6">
          <Typography variant="caption" color="subtext">PACIENTE ATENDIDO</Typography>
          <Typography variant="h3" className="text-base mt-0.5">{patientName}</Typography>
        </Card>

        {/* Informações Confidenciais */}
        <View className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl flex-row items-start mb-6">
          <ShieldAlert color="#0D9488" size={20} className="mt-0.5" />
          <View className="flex-1 pl-3">
            <Typography variant="captionBold" color="primary" className="text-sm">Acesso Clínico Restrito (LGPD)</Typography>
            <Typography variant="caption" color="subtext" className="mt-1 leading-5">
              Este prontuário médico é totalmente confidencial e criptografado. Apenas o profissional de CRP habilitado possui autorização de visualização e edição.
            </Typography>
          </View>
        </View>

        {/* Campo CID-10 */}
        <Input
          label="Código Diagnóstico Principal (CID-10)"
          value={diagnosisCode}
          onChangeText={setDiagnosisCode}
          placeholder="Ex: F41.1"
          editable={!isSigned}
        />

        {/* Campo Evolução Clínica (CFM) */}
        <View className="mb-6">
          <Typography variant="captionBold" color="subtext" className="mb-2 uppercase tracking-wider">Evolução Clínica e Sessão (Obrigatório)</Typography>
          <View className={`rounded-2xl border-2 px-4 py-3 bg-transparent transition-all h-36 ${isDark ? 'border-brand-darkSurface bg-brand-darkSurface' : 'border-slate-200 bg-white'}`}>
            <TextInput
              value={evolutionText}
              onChangeText={setEvolutionText}
              placeholder="Descreva as evoluções clínicas, respostas emocionais, insights e planos de ação acordados nesta sessão..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              multiline
              editable={!isSigned}
              style={{ textAlignVertical: 'top' }}
              className={`flex-1 text-sm ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}
            />
          </View>
        </View>

        {/* Campo Notas Privadas */}
        <View className="mb-8">
          <Typography variant="captionBold" color="subtext" className="mb-2 uppercase tracking-wider">Anotações Pessoais (Rascunho Interno)</Typography>
          <View className={`rounded-2xl border-2 px-4 py-3 bg-transparent transition-all h-24 ${isDark ? 'border-brand-darkSurface bg-brand-darkSurface' : 'border-slate-200 bg-white'}`}>
            <TextInput
              value={privateNotes}
              onChangeText={setPrivateNotes}
              placeholder="Lembretes pessoais rápidos (não serão salvos no prontuário público do paciente)..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              multiline
              editable={!isSigned}
              style={{ textAlignVertical: 'top' }}
              className={`flex-1 text-sm ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}
            />
          </View>
        </View>

        {/* Histórico Clínico Anterior */}
        {patientHistory.length > 0 && (
          <View className="mb-10">
            <Typography variant="h2" className="mb-4">Histórico Clínico Anterior</Typography>
            {patientHistory.map((rec) => (
              <Card key={rec.id} className="p-4 mb-4">
                <View className="flex-row justify-between mb-2">
                  <Badge label={rec.diagnosisCode || 'CID'} variant="secondary" />
                  <Typography variant="captionBold" color="subtext">
                    {new Date(rec.createdAt).toLocaleDateString('pt-BR')}
                  </Typography>
                </View>
                <Typography variant="body" color="subtext" className="text-sm leading-6">
                  {rec.evolutionText}
                </Typography>
              </Card>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Botão de Finalização / Assinatura */}
      <View className="p-6 border-t border-slate-100 dark:border-slate-800 flex-row gap-4 bg-transparent">
        {isSigned ? (
          <View className="bg-brand-success/15 border border-brand-success/20 flex-row items-center justify-center p-4.5 rounded-2xl w-full">
            <CheckCircle2 color="#10B981" size={20} />
            <Typography variant="bodyBold" color="success" className="pl-2">Prontuário Assinado Digitalmente</Typography>
          </View>
        ) : (
          <Button
            title="Assinar e Salvar"
            onPress={handleSaveAndSign}
            variant="secondary"
            isLoading={isSaving}
            icon={<FileSignature color="white" size={18} />}
            className="w-full py-4 bg-brand-secondary shadow-brand-secondary/20"
          />
        )}
      </View>

    </SafeAreaView>
  );
};
