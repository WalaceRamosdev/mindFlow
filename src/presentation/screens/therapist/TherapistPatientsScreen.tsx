import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Card } from '../../components/molecules/Card';
import { Avatar } from '../../components/atoms/Avatar';
import { Input } from '../../components/atoms/Input';
import { useThemeStore } from '../../store/useThemeStore';
import { Search, ChevronRight, FileText, Calendar, ShieldCheck } from 'lucide-react-native';

const PATIENTS = [
  { id: 'usr_patient_01', name: 'Gabriel Vasconcelos', age: 24, lastSession: '12/05/2026', totalSessions: 5, diagnosis: 'F41.1 - Ansiedade Generalizada' },
  { id: 'usr_patient_02', name: 'Mariana Azevedo', age: 29, lastSession: '10/05/2026', totalSessions: 12, diagnosis: 'F32.1 - Depressão Moderada' },
  { id: 'usr_patient_03', name: 'Roberto Firmino', age: 41, lastSession: '08/05/2026', totalSessions: 3, diagnosis: 'F43.1 - Estresse Pós-Traumático' },
];

export const TherapistPatientsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [searchText, setSearchText] = useState('');

  const filteredPatients = PATIENTS.filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()));

  const handlePatientPress = (patient: typeof PATIENTS[0]) => {
    Alert.alert(
      patient.name,
      `Idade: ${patient.age} anos\nTotal de Sessões: ${patient.totalSessions}\nÚltimo Atendimento: ${patient.lastSession}\nDiagnóstico Ativo: ${patient.diagnosis}`,
      [
        {
          text: 'Ver Prontuário Completo',
          onPress: () => {
            navigation.navigate('MedicalRecordEdit', {
              patientId: patient.id,
              patientName: patient.name,
            });
          }
        },
        { text: 'Fechar', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <View className="px-6 pt-6 flex-1">
        
        {/* Header */}
        <Typography variant="h1" className="text-2xl mb-4">Meus Pacientes</Typography>

        {/* Input Pesquisa */}
        <Input
          placeholder="Pesquisar paciente..."
          value={searchText}
          onChangeText={setSearchText}
          iconLeft={<Search color="#94A3B8" size={20} />}
          className="mb-6"
        />

        {/* Lista de Pacientes */}
        {filteredPatients.length > 0 ? (
          <FlatList
            data={filteredPatients}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Card
                onPress={() => handlePatientPress(item)}
                className="mb-4 flex-row items-center justify-between p-4"
              >
                <View className="flex-row items-center flex-1">
                  <Avatar source={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=4F46E5&color=fff`} size="md" />
                  <View className="pl-4 flex-1">
                    <Typography variant="h3" className="text-base font-semibold">{item.name}</Typography>
                    <Typography variant="caption" color="subtext" className="mt-0.5">
                      Última sessão: {item.lastSession} • {item.totalSessions} atendimentos
                    </Typography>
                  </View>
                </View>
                
                <ChevronRight color="#94A3B8" size={18} />
              </Card>
            )}
          />
        ) : (
          <View className="flex-1 items-center justify-center pb-24">
            <Typography variant="h3" color="subtext" className="text-center mb-2">Nenhum paciente encontrado</Typography>
            <Typography variant="body" color="subtext" className="text-center text-sm">Verifique a ortografia ou tente outro nome.</Typography>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
};
