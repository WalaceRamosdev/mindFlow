import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Card } from '../../components/molecules/Card';
import { Avatar } from '../../components/atoms/Avatar';
import { Input } from '../../components/atoms/Input';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Search, SlidersHorizontal, Star, ShieldCheck } from 'lucide-react-native';

const SPECIALTIES = [
  'Todos',
  'Terapia Cognitivo-Comportamental (TCC)',
  'Psicanálise',
  'Ansiedade e Depressão',
  'Terapia de Casal'
];

export const PatientSearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { therapists } = useAppointmentStore();
  const isDark = theme === 'dark';

  const [searchText, setSearchText] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todos');

  // Filtra psicólogos
  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSearch = therapist.user?.fullName.toLowerCase().includes(searchText.toLowerCase()) || 
                          therapist.bio.toLowerCase().includes(searchText.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'Todos' || therapist.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <View className="px-6 pt-6 flex-1">
        
        {/* Header */}
        <Typography variant="h1" className="text-2xl mb-4">
          Buscar Psicólogos
        </Typography>

        {/* Barra de Busca */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1 mr-3">
            <Input
              placeholder="Nome ou especialidade do profissional..."
              value={searchText}
              onChangeText={setSearchText}
              className="mb-0"
              iconLeft={<Search color="#94A3B8" size={20} />}
            />
          </View>
          <TouchableOpacity
            className={`w-12 h-12 rounded-2xl items-center justify-center border ${isDark ? 'bg-brand-darkSurface border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <SlidersHorizontal color="#0D9488" size={20} />
          </TouchableOpacity>
        </View>

        {/* Filtro Rápido Horizontal */}
        <View className="mb-6 h-10">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
            {SPECIALTIES.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              return (
                <TouchableOpacity
                  key={spec}
                  onPress={() => setSelectedSpecialty(spec)}
                  className={`px-4 py-2 rounded-full mr-3 border transition-all
                    ${isSelected ? 'bg-brand-primary border-brand-primary' : isDark ? 'bg-brand-darkSurface border-slate-800' : 'bg-white border-slate-200'}
                  `}
                >
                  <Typography variant="captionBold" className={isSelected ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {spec}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Listagem */}
        {filteredTherapists.length > 0 ? (
          <FlatList
            data={filteredTherapists}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Card
                onPress={() => navigation.navigate('TherapistProfile', { therapistId: item.id })}
                className="p-5 flex-row items-center justify-between border border-slate-150 dark:border-slate-800 mb-5"
              >
                {/* Bloco de Informações na Esquerda */}
                <View className="flex-1 pr-4 justify-between">
                  <View>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Typography variant="h3" className="text-base font-bold mr-1.5">
                          {item.user?.fullName}
                        </Typography>
                        {item.isApproved && <ShieldCheck color="#0D9488" size={16} />}
                      </View>
                    </View>
                    <Typography variant="caption" color="subtext" className="text-xs mt-1">
                      {item.crp} • {item.specialties[0]}
                    </Typography>
                  </View>

                  {/* Métricas e Preço na Esquerda (Logo abaixo do Nome/Especialidades) */}
                  <View className="flex-row justify-between items-center mt-4">
                    <View className="flex-row items-center">
                      <Star color="#F59E0B" size={13} fill="#F59E0B" />
                      <Typography variant="captionBold" className="ml-1 text-xs font-semibold">
                        {item.rating.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="subtext" className="ml-1.5 text-xs">
                        ({item.yearsOfExperience} anos exp)
                      </Typography>
                    </View>
                    <Typography variant="bodyBold" color="primary" className="text-xs font-bold">
                      R$ {item.pricePerSession.toFixed(0)}/sessão
                    </Typography>
                  </View>
                </View>

                {/* Avatar na Extrema Direita (Space-Between) */}
                <Avatar source={item.user?.avatarUrl} size="md" className="self-auto" />
              </Card>
            )}
          />
        ) : (
          <View className="flex-1 items-center justify-center pb-24">
            <Typography variant="h3" color="subtext" className="text-center mb-2">
              Nenhum psicólogo encontrado
            </Typography>
            <Typography variant="body" color="subtext" className="text-center text-sm px-10">
              Experimente ajustar sua busca ou selecionar uma especialidade diferente.
            </Typography>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
};
