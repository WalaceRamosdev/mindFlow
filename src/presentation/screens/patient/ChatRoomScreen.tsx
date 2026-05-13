import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components/atoms/Typography';
import { Avatar } from '../../components/atoms/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useThemeStore } from '../../store/useThemeStore';
import { ArrowLeft, Send, Image as ImageIcon, FileText, Mic, MoreVertical, PhoneCall } from 'lucide-react-native';

export const ChatRoomScreen: React.FC<{ route?: any; navigation: any }> = ({ route, navigation }) => {
  const partnerId = route?.params?.partnerId || 'usr_therapist_01';
  const partnerName = route?.params?.partnerName || 'Dr. Arthur Mendes';

  const { user } = useAuthStore();
  const { chats, sendMessage, fetchMessages, markAsRead, onlineUsers } = useChatStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [inputText, setInputText] = useState('');
  const messages = chats[partnerId] || [];
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages(user?.id || '', partnerId);
    markAsRead(user?.id || '', partnerId);
  }, [partnerId]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(user?.id || '', partnerId, inputText);
    setInputText('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendAttachment = (type: 'image' | 'pdf') => {
    Alert.alert(
      'Enviar Anexo',
      `Simulando o upload de arquivo do tipo ${type.toUpperCase()} para o Supabase Storage.`,
      [
        {
          text: 'Confirmar Envio',
          onPress: () => {
            const url = type === 'image' 
              ? 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=300&q=80'
              : 'https://mindflow.com/docs/prescricao_medica.pdf';
            sendMessage(user?.id || '', partnerId, undefined, { url, type });
          }
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-brand-darkBg' : 'bg-brand-lightBg'}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        
        {/* Header Sala de Conversa */}
        <View className={`flex-row justify-between items-center px-6 py-4 border-b ${isDark ? 'bg-brand-darkSurface border-slate-800' : 'bg-white border-slate-100'}`}>
          <View className="flex-row items-center flex-1 mr-4">
            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
              <ArrowLeft color={isDark ? 'white' : 'black'} size={24} />
            </TouchableOpacity>
            
            <Avatar source="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80" size="sm" isOnline={onlineUsers.has(partnerId)} />
            
            <View className="flex-1 pl-3">
              <Typography variant="h3" className="text-base" numberOfLines={1}>
                {partnerName}
              </Typography>
              <Typography variant="caption" color="subtext" className="text-xs">
                {onlineUsers.has(partnerId) ? 'Online' : 'Visto por último hoje'}
              </Typography>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="p-2.5 mr-1" onPress={() => Alert.alert('Chamada de Voz', 'Ligando para o profissional via canal VoIP criptografado...')}>
              <PhoneCall color="#0D9488" size={20} />
            </TouchableOpacity>
            <TouchableOpacity className="p-2.5">
              <MoreVertical color={isDark ? '#94A3B8' : '#64748B'} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Listagem de Mensagens */}
        <View className="flex-1 px-6">
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => {
              const isMe = item.senderId === user?.id;
              return (
                <View className={`flex-row mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <View
                    className={`max-w-[75%] rounded-3xl p-4 shadow-sm
                      ${isMe 
                        ? 'bg-brand-primary rounded-tr-none shadow-brand-primary/10' 
                        : isDark ? 'bg-brand-darkSurface rounded-tl-none border border-slate-800' : 'bg-white rounded-tl-none border border-slate-100'}
                    `}
                  >
                    {item.content && (
                      <Typography
                        variant="body"
                        className={isMe ? 'text-white text-sm' : 'text-sm'}
                      >
                        {item.content}
                      </Typography>
                    )}

                    {/* Exibição de imagem anexada */}
                    {item.attachmentUrl && item.attachmentType === 'image' && (
                      <Image source={{ uri: item.attachmentUrl }} className="w-48 h-32 rounded-2xl mb-1 mt-1" resizeMode="cover" />
                    )}

                    {/* Exibição de PDF anexado */}
                    {item.attachmentUrl && item.attachmentType === 'pdf' && (
                      <View className="flex-row items-center p-2.5 bg-black/10 rounded-2xl mt-1">
                        <FileText color={isMe ? 'white' : '#0D9488'} size={24} />
                        <Typography variant="captionBold" className={`pl-2 pr-4 text-xs ${isMe ? 'text-white' : ''}`} numberOfLines={1}>
                          Receita_Médica.pdf
                        </Typography>
                      </View>
                    )}

                    <Typography
                      variant="caption"
                      className={`text-[9px] mt-1.5 text-right
                        ${isMe ? 'text-white/60' : 'text-slate-400'}
                      `}
                    >
                      {new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </View>
                </View>
              );
            }}
          />
        </View>

        {/* Input Bar de Digitação */}
        <View className={`flex-row items-center px-6 py-4 border-t ${isDark ? 'bg-brand-darkSurface border-slate-800' : 'bg-white border-slate-100'}`}>
          <TouchableOpacity onPress={() => handleSendAttachment('image')} className="p-2 mr-1">
            <ImageIcon color="#94A3B8" size={22} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => handleSendAttachment('pdf')} className="p-2 mr-2">
            <FileText color="#94A3B8" size={22} />
          </TouchableOpacity>

          <View className={`flex-1 flex-row items-center rounded-2xl px-4 py-2.5 border ${isDark ? 'bg-brand-darkBg border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            <TextInput
              placeholder="Mensagem..."
              value={inputText}
              onChangeText={setInputText}
              className={`flex-1 text-sm h-6 p-0 ${isDark ? 'text-white' : 'text-black'}`}
              placeholderTextColor="#94A3B8"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity onPress={() => Alert.alert('Áudio', 'Iniciando gravação de mensagem de áudio em alta fidelidade...')}>
              <Mic color="#94A3B8" size={18} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSend}
            className="w-11 h-11 bg-brand-primary rounded-full items-center justify-center ml-3 shadow-md shadow-brand-primary/20"
          >
            <Send color="white" size={18} className="ml-0.5" />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
