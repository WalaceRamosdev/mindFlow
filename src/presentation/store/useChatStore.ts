import { create } from 'zustand';
import { Message } from '../../domain/entities';

interface ChatState {
  chats: Record<string, Message[]>; // userId -> Messages
  activeChatPartnerId: string | null;
  isLoading: boolean;
  onlineUsers: Set<string>;

  // Ações
  sendMessage: (senderId: string, receiverId: string, content?: string, attachment?: { url: string; type: 'image' | 'pdf' | 'audio' }) => Promise<void>;
  fetchMessages: (userId: string, partnerId: string) => Promise<void>;
  markAsRead: (receiverId: string, senderId: string) => Promise<void>;
  setOnlineStatus: (userId: string, isOnline: boolean) => void;
}

// Mensagens fictícias iniciais para preencher o chat
const MOCK_MESSAGES: Record<string, Message[]> = {
  'usr_therapist_01': [
    {
      id: 'm1',
      senderId: 'usr_therapist_01',
      receiverId: 'usr_patient_01',
      content: 'Olá Gabriel, tudo bem? Gostaria de saber se você conseguiu fazer os exercícios de meditação reflexiva que passamos na última sessão?',
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString() // 3 horas atrás
    },
    {
      id: 'm2',
      senderId: 'usr_patient_01',
      receiverId: 'usr_therapist_01',
      content: 'Olá Dr. Arthur! Consegui sim. No início foi um pouco difícil me concentrar, mas depois de 5 minutos me senti mais calmo.',
      isRead: true,
      createdAt: new Date(Date.now() - 2.8 * 3600000).toISOString()
    },
    {
      id: 'm3',
      senderId: 'usr_therapist_01',
      receiverId: 'usr_patient_01',
      content: 'Excelente! Isso é super normal no começo. O importante é a consistência. Nos vemos em nossa sessão de amanhã!',
      isRead: false,
      createdAt: new Date(Date.now() - 2.5 * 3600000).toISOString()
    }
  ],
  'usr_therapist_02': [
    {
      id: 'm4',
      senderId: 'usr_therapist_02',
      receiverId: 'usr_patient_01',
      content: 'Olá, Gabriel. Segue o recibo de sua consulta da semana passada para fins de reembolso do seu plano de saúde.',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
    },
    {
      id: 'm5',
      senderId: 'usr_therapist_02',
      receiverId: 'usr_patient_01',
      attachmentUrl: 'https://mindflow.com/receipts/recibo_123.pdf',
      attachmentType: 'pdf',
      isRead: true,
      createdAt: new Date(Date.now() - 23.9 * 3600000).toISOString()
    }
  ]
};

export const useChatStore = create<ChatState>((set, get) => ({
  chats: MOCK_MESSAGES,
  activeChatPartnerId: null,
  isLoading: false,
  onlineUsers: new Set(['usr_therapist_01', 'usr_patient_01']),

  sendMessage: async (senderId, receiverId, content, attachment) => {
    // Cria o objeto de mensagem
    const newMessage: Message = {
      id: `msg_${Math.random().toString(36).substring(2, 9)}`,
      senderId,
      receiverId,
      content,
      attachmentUrl: attachment?.url,
      attachmentType: attachment?.type,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    // Atualiza o estado local de forma síncrona para UI instantânea (Optimistic Update)
    set((state) => {
      const partnerId = senderId === state.activeChatPartnerId ? receiverId : senderId;
      const history = state.chats[partnerId] || [];
      return {
        chats: {
          ...state.chats,
          [partnerId]: [...history, newMessage]
        }
      };
    });

    // Simula envio ao servidor/Supabase Realtime
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  fetchMessages: async (userId, partnerId) => {
    set({ isLoading: true, activeChatPartnerId: partnerId });
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({ isLoading: false });
  },

  markAsRead: async (receiverId, senderId) => {
    set((state) => {
      const history = state.chats[senderId] || [];
      const updatedHistory = history.map((msg) => 
        msg.receiverId === receiverId ? { ...msg, isRead: true } : msg
      );
      return {
        chats: {
          ...state.chats,
          [senderId]: updatedHistory
        }
      };
    });
  },

  setOnlineStatus: (userId, isOnline) => {
    set((state) => {
      const nextSet = new Set(state.onlineUsers);
      if (isOnline) {
        nextSet.add(userId);
      } else {
        nextSet.delete(userId);
      }
      return { onlineUsers: nextSet };
    });
  }
}));
