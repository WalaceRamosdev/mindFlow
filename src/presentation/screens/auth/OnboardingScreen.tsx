import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Cuidado Humanizado',
    description: 'Encontre psicólogos altamente qualificados, credenciados e prontos para te ouvir e acolher com o máximo profissionalismo.',
    image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Sessões em Tempo Real',
    description: 'Realize suas consultas por videochamada de alta qualidade com criptografia de ponta a ponta sem precisar sair de casa.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Prontuário & Segurança',
    description: 'Armazenamento ultra-seguro compatível com a LGPD. Suas informações de saúde e evolução clínica protegidas contra acessos não autorizados.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=500&q=80',
  }
];

export const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.replace('ProfileSelection');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-darkBg justify-between">
      {/* Botão Pular */}
      <View className="flex-row justify-end px-6 pt-4">
        <TouchableOpacity onPress={() => navigation.replace('ProfileSelection')}>
          <Typography variant="captionBold" color="subtext" className="text-sm">
            PULAR
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Conteúdo do Slide */}
      <View className="px-6 items-center">
        {/* Imagem do Slide com Bordas Suaves e Sombra */}
        <Image
          source={{ uri: SLIDES[currentSlide].image }}
          className="w-full h-72 rounded-3xl mb-8 border border-slate-800"
          resizeMode="cover"
        />

        <Typography variant="h1" className="text-white text-3xl font-extrabold text-center mb-4">
          {SLIDES[currentSlide].title}
        </Typography>

        <Typography variant="body" color="subtext" className="text-center text-base leading-6 px-4">
          {SLIDES[currentSlide].description}
        </Typography>
      </View>

      {/* Indicadores & Botão Continuar */}
      <View className="px-6 pb-10">
        {/* Dots */}
        <View className="flex-row justify-center mb-8">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              className={`h-2.5 rounded-full mx-1.5 transition-all
                ${index === currentSlide ? 'w-8 bg-brand-primary' : 'w-2.5 bg-slate-800'}
              `}
            />
          ))}
        </View>

        <Button
          title={currentSlide === SLIDES.length - 1 ? 'Começar Agora' : 'Próximo'}
          onPress={handleNext}
          variant="primary"
          className="w-full py-4.5"
        />
      </View>
    </SafeAreaView>
  );
};
