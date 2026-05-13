import { create } from 'zustand';
import * as Calendar from 'expo-calendar';
import { Appointment, Therapist, Availability } from '../../domain/entities';
import { PushNotificationService } from '../../infrastructure/services/notifications';
import { Platform } from 'react-native';

interface AppointmentState {
  appointments: Appointment[];
  therapists: Therapist[];
  availabilities: Record<string, Availability[]>; // therapistId -> Availabilities
  isLoading: boolean;
  error: string | null;

  // Ações
  fetchAppointments: (userId: string, role: 'patient' | 'therapist') => Promise<void>;
  fetchTherapists: () => Promise<void>;
  fetchAvailability: (therapistId: string) => Promise<void>;
  bookAppointment: (patientId: string, therapistId: string, scheduledTime: string) => Promise<boolean>;
  rescheduleAppointment: (appointmentId: string, newTime: string) => Promise<boolean>;
  cancelAppointment: (appointmentId: string, reason: string) => Promise<boolean>;
  rateTherapist: (appointmentId: string, rating: number, comment?: string) => Promise<void>;
}

// Mock inicial de psicólogos com fotos profissionais reais do Unsplash
const MOCK_THERAPISTS: Therapist[] = [
  {
    id: 'usr_therapist_01',
    crp: 'CRP 06/123456',
    bio: 'Especialista em Terapia Cognitivo-Comportamental (TCC) voltada para tratamento de ansiedade, fobias e depressão. Mais de 8 anos de experiência em atendimento clínico humanizado e acolhedor.',
    specialties: ['Terapia Cognitivo-Comportamental (TCC)', 'Ansiedade e Depressão'],
    pricePerSession: 150.00,
    yearsOfExperience: 8,
    rating: 4.9,
    isApproved: true,
    googleCalendarConnected: true,
    appleCalendarConnected: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: 'usr_therapist_01',
      email: 'arthur.mendes@mindflow.com',
      fullName: 'Dr. Arthur Mendes',
      role: 'therapist',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      biometricEnabled: false,
      themePreference: 'light',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'usr_therapist_02',
    crp: 'CRP 06/789012',
    bio: 'Psicanalista focada em desenvolvimento pessoal, autoconhecimento profundo e superação de traumas de infância. Ofereço um ambiente virtual seguro, acolhedor e confidencial para seu florescimento mental.',
    specialties: ['Psicanálise', 'Ansiedade e Depressão'],
    pricePerSession: 180.00,
    yearsOfExperience: 12,
    rating: 5.0,
    isApproved: true,
    googleCalendarConnected: false,
    appleCalendarConnected: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: 'usr_therapist_02',
      email: 'carla.souza@mindflow.com',
      fullName: 'Dra. Carla Souza',
      role: 'therapist',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&w=300&q=80',
      biometricEnabled: false,
      themePreference: 'light',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'usr_therapist_03',
    crp: 'CRP 06/998877',
    bio: 'Especialista em mediação conjugal, conflitos familiares e inteligência emocional em relacionamentos afetivos. Auxilio casais a superarem barreiras de comunicação e reconstruírem a conexão perdida.',
    specialties: ['Terapia de Casal', 'Terapia Organizacional'],
    pricePerSession: 160.00,
    yearsOfExperience: 6,
    rating: 4.8,
    isApproved: true,
    googleCalendarConnected: false,
    appleCalendarConnected: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: 'usr_therapist_03',
      email: 'marcos.palermo@mindflow.com',
      fullName: 'Dr. Marcos Palermo',
      role: 'therapist',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
      biometricEnabled: false,
      themePreference: 'light',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
];

const MOCK_AVAILABILITIES: Record<string, Availability[]> = {
  'usr_therapist_01': [
    { id: 'av_1', therapistId: 'usr_therapist_01', dayOfWeek: 1, startTime: '09:00', endTime: '10:00', isBlocked: false },
    { id: 'av_2', therapistId: 'usr_therapist_01', dayOfWeek: 1, startTime: '11:00', endTime: '12:00', isBlocked: false },
    { id: 'av_3', therapistId: 'usr_therapist_01', dayOfWeek: 2, startTime: '14:00', endTime: '15:00', isBlocked: false },
    { id: 'av_4', therapistId: 'usr_therapist_01', dayOfWeek: 3, startTime: '16:00', endTime: '17:00', isBlocked: false },
  ],
  'usr_therapist_02': [
    { id: 'av_5', therapistId: 'usr_therapist_02', dayOfWeek: 2, startTime: '09:00', endTime: '10:00', isBlocked: false },
    { id: 'av_6', therapistId: 'usr_therapist_02', dayOfWeek: 2, startTime: '10:00', endTime: '11:00', isBlocked: false },
    { id: 'av_7', therapistId: 'usr_therapist_02', dayOfWeek: 4, startTime: '15:00', endTime: '16:00', isBlocked: false },
  ],
  'usr_therapist_03': [
    { id: 'av_8', therapistId: 'usr_therapist_03', dayOfWeek: 3, startTime: '10:00', endTime: '11:00', isBlocked: false },
    { id: 'av_9', therapistId: 'usr_therapist_03', dayOfWeek: 5, startTime: '14:00', endTime: '15:00', isBlocked: false },
  ]
};

// Consultas fictícias iniciais para popular o app
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_01',
    patientId: 'usr_patient_01',
    therapistId: 'usr_therapist_01',
    therapist: MOCK_THERAPISTS[0],
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000 * 2).toISOString(), // Daqui a 2 dias
    durationMinutes: 50,
    status: 'confirmed',
    videoRoomId: 'room_apt_01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt_02',
    patientId: 'usr_patient_01',
    therapistId: 'usr_therapist_02',
    therapist: MOCK_THERAPISTS[1],
    scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5).toISOString(), // Há 5 dias atrás
    durationMinutes: 50,
    status: 'completed',
    videoRoomId: 'room_apt_02',
    ratingScore: 5,
    ratingComment: 'Dra Carla é fantástica, muito atenciosa e certeira nas observações!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: MOCK_APPOINTMENTS,
  therapists: MOCK_THERAPISTS,
  availabilities: MOCK_AVAILABILITIES,
  isLoading: false,
  error: null,

  fetchAppointments: async (userId, role) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Filtra as consultas do usuário de acordo com o papel (Paciente ou Psicólogo)
      const userApts = get().appointments.filter((apt) => {
        return role === 'patient' ? apt.patientId === userId : apt.therapistId === userId;
      });
      set({ isLoading: false });
    } catch {
      set({ error: 'Erro ao buscar consultas', isLoading: false });
    }
  },

  fetchTherapists: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ therapists: MOCK_THERAPISTS, isLoading: false });
  },

  fetchAvailability: async (therapistId) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ isLoading: false });
  },

  bookAppointment: async (patientId, therapistId, scheduledTime) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const therapist = get().therapists.find(t => t.id === therapistId);
      const newApt: Appointment = {
        id: `apt_${Math.random().toString(36).substring(2, 9)}`,
        patientId,
        therapistId,
        therapist,
        scheduledTime,
        durationMinutes: 50,
        status: 'confirmed',
        videoRoomId: `room_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Integração com Calendário do Dispositivo (Expo Calendar)
      if (Platform.OS !== 'web') {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
          const defaultCalendar = await Calendar.getDefaultCalendarAsync();
          if (defaultCalendar) {
            const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
              title: `Consulta Psicológica - ${therapist?.user?.fullName || 'MindFlow'}`,
              startDate: new Date(scheduledTime),
              endDate: new Date(new Date(scheduledTime).getTime() + 50 * 60000),
              notes: 'Sessão de terapia online via aplicativo MindFlow.',
              timeZone: 'GMT-3',
            });
            newApt.googleEventId = eventId;
          }
        }
      }

      // Agendar Notificação Local automática (Push Notification)
      const triggerTime = new Date(new Date(scheduledTime).getTime() - 15 * 60000); // 15 minutos antes
      await PushNotificationService.scheduleAppointmentReminder(
        newApt.id,
        'Sua sessão começará em breve! 🧠',
        `Sua consulta com ${therapist?.user?.fullName || 'o psicólogo'} está agendada para daqui a 15 minutos. Prepare seu ambiente.`,
        triggerTime
      );

      set((state) => ({
        appointments: [newApt, ...state.appointments],
        isLoading: false
      }));

      return true;
    } catch (e: any) {
      console.error(e);
      set({ error: 'Falha ao agendar consulta', isLoading: false });
      return false;
    }
  },

  rescheduleAppointment: async (appointmentId, newTime) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      const appointments = get().appointments.map((apt) => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            scheduledTime: newTime,
            status: 'confirmed' as const,
            updatedAt: new Date().toISOString()
          };
        }
        return apt;
      });

      set({ appointments, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  cancelAppointment: async (appointmentId, reason) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const appointments = get().appointments.map((apt) => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            status: 'canceled' as const,
            cancellationReason: reason,
            updatedAt: new Date().toISOString()
          };
        }
        return apt;
      });

      set({ appointments, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  rateTherapist: async (appointmentId, rating, comment) => {
    const appointments = get().appointments.map((apt) => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          ratingScore: rating,
          ratingComment: comment,
          updatedAt: new Date().toISOString()
        };
      }
      return apt;
    });
    set({ appointments });
  }
}));
