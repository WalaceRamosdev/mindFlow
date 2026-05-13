import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { Typography } from '../../components/atoms/Typography';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export const VideoCallScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { doctorName } = route.params;

  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [seconds, setSeconds] = useState(0);

  // Contador de duração da chamada em tempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'Encerrar Consulta?',
      'Deseja realmente finalizar esta sessão de teleconsulta?',
      [
        {
          text: 'Encerrar',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
          }
        },
        { text: 'Voltar à Consulta', style: 'cancel' }
      ]
    );
  };

  return (
    <View className="flex-1 bg-brand-darkBg relative">
      
      {/* Feed de Vídeo Grande (Terapeuta/Médico) */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80' }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />

      {/* Overlay Escuro para Contraste Superior */}
      <View className="absolute inset-0 bg-black/30" />

      {/* Header Info (Médico, Status e Cronômetro) */}
      <SafeAreaView className="absolute top-6 left-6 right-6 flex-row justify-between items-center">
        <View className="bg-black/50 px-4 py-2.5 rounded-2xl flex-row items-center border border-white/10">
          <View className="w-2.5 h-2.5 rounded-full bg-brand-danger mr-2.5 animate-pulse" />
          <Typography variant="captionBold" className="text-white text-xs">
            {formatTime(seconds)} • CONSULTA AO VIVO
          </Typography>
        </View>

        <View className="bg-black/50 px-4 py-2.5 rounded-2xl border border-white/10">
          <Typography variant="captionBold" className="text-white text-xs">
            {doctorName}
          </Typography>
        </View>
      </SafeAreaView>

      {/* Feed de Vídeo Pequeno (Paciente - Canto Inferior Direito) */}
      {videoActive ? (
        <View className="absolute bottom-32 right-6 w-32 h-44 rounded-3xl overflow-hidden border-2 border-white/20 shadow-lg shadow-black/40">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      ) : (
        <View className="absolute bottom-32 right-6 w-32 h-44 bg-slate-900 rounded-3xl border-2 border-white/20 items-center justify-center shadow-lg shadow-black/40">
          <VideoOff color="#94A3B8" size={24} />
          <Typography variant="caption" color="subtext" className="mt-2 text-[10px]">Câmera Desligada</Typography>
        </View>
      )}

      {/* Barra de Ação de Controles de Chamada */}
      <View className="absolute bottom-10 left-6 right-6 flex-row justify-center items-center gap-5">
        {/* Toggle Áudio */}
        <TouchableOpacity
          onPress={() => setMicActive(!micActive)}
          className={`w-14 h-14 rounded-full items-center justify-center border border-white/10 shadow-lg shadow-black/25
            ${micActive ? 'bg-white/15' : 'bg-brand-danger'}
          `}
        >
          {micActive ? <Mic color="white" size={22} /> : <MicOff color="white" size={22} />}
        </TouchableOpacity>

        {/* Botão Vermelho Encerrar Chamada */}
        <TouchableOpacity
          onPress={handleEndCall}
          className="w-18 h-18 bg-brand-danger rounded-full items-center justify-center shadow-lg shadow-brand-danger/30"
        >
          <PhoneOff color="white" size={28} />
        </TouchableOpacity>

        {/* Toggle Vídeo */}
        <TouchableOpacity
          onPress={() => setVideoActive(!videoActive)}
          className={`w-14 h-14 rounded-full items-center justify-center border border-white/10 shadow-lg shadow-black/25
            ${videoActive ? 'bg-white/15' : 'bg-brand-danger'}
          `}
        >
          {videoActive ? <Video color="white" size={22} /> : <VideoOff color="white" size={22} />}
        </TouchableOpacity>
      </View>

    </View>
  );
};
