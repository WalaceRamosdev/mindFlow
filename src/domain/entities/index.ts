// ==========================================
// MINDFLOW DOMAIN ENTITIES (TYPESCRIPT)
// ==========================================
// Tipos de dados de domínio puros que representam nossos modelos de negócios.

export type UserRole = 'patient' | 'therapist' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
  biometricEnabled: boolean;
  themePreference: 'light' | 'dark';
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string; // Referência a User.id
  user?: User; // Objeto de perfil completo associado
  cpf?: string;
  birthDate?: string;
  emergencyContact?: string;
  notes?: string;
  isSubscribed: boolean;
  subscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Therapist {
  id: string; // Referência a User.id
  user?: User; // Objeto de perfil completo associado
  crp: string;
  bio: string;
  specialties: string[];
  pricePerSession: number;
  yearsOfExperience: number;
  rating: number;
  isApproved: boolean;
  googleCalendarConnected: boolean;
  appleCalendarConnected: boolean;
  digitalSignatureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'canceled' | 'completed' | 'rescheduled';

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  therapistId: string;
  therapist?: Therapist;
  scheduledTime: string; // ISO String UTC
  durationMinutes: number;
  status: AppointmentStatus;
  cancellationReason?: string;
  videoRoomId?: string;
  ratingScore?: number;
  ratingComment?: string;
  googleEventId?: string;
  appleEventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  therapistId: string;
  evolutionText: string; // Criptografado no armazenamento real
  diagnosisCode?: string; // CID-10
  privateNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 'prescription' | 'certificate' | 'receipt' | 'report';

export interface Document {
  id: string;
  patientId: string;
  therapistId: string;
  title: string;
  type: DocumentType;
  fileUrl: string;
  isSigned: boolean;
  digitalSignatureHash?: string;
  createdAt: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';

export interface Payment {
  id: string;
  appointmentId?: string;
  patientId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  pixQrCode?: string;
  pixExpiration?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf' | 'audio';
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Availability {
  id: string;
  therapistId: string;
  dayOfWeek: number; // 0 (Domingo) a 6 (Sábado)
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  isBlocked: boolean;
}
