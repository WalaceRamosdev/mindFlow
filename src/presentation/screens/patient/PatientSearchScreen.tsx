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
                className="mb-4 flex-row p-4"
              >
                <Avatar source={item.user?.avatarUrl} size="md" />

                <View className="flex-1 pl-4 justify-between">
                  <View>
                    <View className="flex-row items-center">
                      <Typography variant="h3" className="text-base font-semibold mr-1.5">
                        {item.user?.fullName}
                      </Typography>
                      {item.isApproved && <ShieldCheck color="#0D9488" size={16} />}
                    </View>
                    <Typography variant="caption" color="subtext" className="mt-0.5">
                      {item.crp} • {item.specialties[0]}
                    </Typography>
                  </View>

                  <View className="flex-row justify-between items-center mt-3">
                    <View className="flex-row items-center">
                      <Star color="#F59E0B" size={14} fill="#F59E0B" />
                      <Typography variant="captionBold" className="ml-1 text-sm">
                        {item.rating.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="subtext" className="ml-1">
                        ({item.yearsOfExperience} anos exp)
                      </Typography>
                    </View>
                    <Typography variant="bodyBold" color="primary">
                      R$ {item.pricePerSession.toFixed(0)}/sessão
                    </Typography>
                  </View>
                </View>
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
