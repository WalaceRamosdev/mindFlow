import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: { role: 'patient' | 'therapist' };
  RecoverPassword: undefined;
  ProfileSelection: undefined;
};

export type PatientTabParamList = {
  PatientHome: undefined;
  PatientSearch: undefined;
  PatientChatList: undefined;
  PatientWallet: undefined;
  PatientSettings: undefined;
};

export type PatientStackParamList = {
  PatientTabs: undefined;
  TherapistProfile: { therapistId: string };
  BookAppointment: { therapistId: string };
  AppointmentDetails: { appointmentId: string };
  ChatRoom: { partnerId: string; partnerName: string };
  VideoCall: { roomId: string; appointmentId: string; doctorName: string };
};

export type TherapistTabParamList = {
  TherapistDashboard: undefined;
  TherapistAgenda: undefined;
  TherapistPatients: undefined;
  TherapistFinancial: undefined;
  TherapistSettings: undefined;
};

export type TherapistStackParamList = {
  TherapistTabs: undefined;
  MedicalRecordEdit: { appointmentId: string; patientId: string; patientName: string };
  DocumentViewer: { fileUrl: string; title: string };
  ChatRoom: { partnerId: string; partnerName: string };
  VideoCall: { roomId: string; appointmentId: string; doctorName: string };
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  DoctorApproval: undefined;
  AdminReports: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Patient: undefined;
  Therapist: undefined;
  Admin: undefined;
};
