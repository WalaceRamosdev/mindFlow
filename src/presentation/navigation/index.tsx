import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

// Ícones
import { Home, Search, MessageSquare, CreditCard, Settings, Calendar, Users, BarChart3, ShieldAlert } from 'lucide-react-native';

// Telas Autenticação
import { SplashScreen } from '../screens/auth/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { RecoverPasswordScreen } from '../screens/auth/RecoverPasswordScreen';
import { ProfileSelectionScreen } from '../screens/auth/ProfileSelectionScreen';

// Telas Paciente
import { PatientHomeScreen } from '../screens/patient/PatientHomeScreen';
import { PatientSearchScreen } from '../screens/patient/PatientSearchScreen';
import { TherapistProfileScreen } from '../screens/patient/TherapistProfileScreen';
import { BookAppointmentScreen } from '../screens/patient/BookAppointmentScreen';
import { ChatRoomScreen } from '../screens/patient/ChatRoomScreen';
import { VideoCallScreen } from '../screens/patient/VideoCallScreen';
import { PatientWalletScreen } from '../screens/patient/PatientWalletScreen';
import { PatientSettingsScreen } from '../screens/patient/PatientSettingsScreen';

// Telas Psicólogo
import { TherapistDashboardScreen } from '../screens/therapist/TherapistDashboardScreen';
import { TherapistAgendaScreen } from '../screens/therapist/TherapistAgendaScreen';
import { TherapistPatientsScreen } from '../screens/therapist/TherapistPatientsScreen';
import { MedicalRecordEditScreen } from '../screens/therapist/MedicalRecordEditScreen';
import { TherapistFinancialScreen } from '../screens/therapist/TherapistFinancialScreen';

// Telas Administrador
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';

// Listas de parâmetros
import { 
  AuthStackParamList, 
  PatientTabParamList, 
  PatientStackParamList, 
  TherapistTabParamList, 
  TherapistStackParamList,
  AdminStackParamList
} from './types';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- 1. FLUXO DE AUTENTICAÇÃO ---
export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="ProfileSelection" component={ProfileSelectionScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />
  </Stack.Navigator>
);

// --- 2. FLUXO TABS PACIENTE ---
const PatientTabNavigator = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0D9488', // Teal
        tabBarInactiveTintColor: isDark ? '#64748B' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: isDark ? '#161E2E' : '#FFFFFF',
          borderTopColor: isDark ? '#1E293B' : '#F1F5F9',
          borderTopWidth: 1.5,
          height: 60,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'PatientHome') return <Home color={color} size={size} />;
          if (route.name === 'PatientSearch') return <Search color={color} size={size} />;
          if (route.name === 'PatientChatList') return <MessageSquare color={color} size={size} />;
          if (route.name === 'PatientWallet') return <CreditCard color={color} size={size} />;
          return <Settings color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="PatientHome" component={PatientHomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="PatientSearch" component={PatientSearchScreen} options={{ title: 'Psicólogos' }} />
      <Tab.Screen name="PatientChatList" component={ChatRoomScreen} options={{ title: 'Conversas' }} />
      <Tab.Screen name="PatientWallet" component={PatientWalletScreen} options={{ title: 'Carteira' }} />
      <Tab.Screen name="PatientSettings" component={PatientSettingsScreen} options={{ title: 'Ajustes' }} />
    </Tab.Navigator>
  );
};

// --- 3. FLUXO COMPLETO PACIENTE (TABS + TELAS INTERNAS) ---
export const PatientNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientTabs" component={PatientTabNavigator} />
    <Stack.Screen name="TherapistProfile" component={TherapistProfileScreen} />
    <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
    <Stack.Screen name="VideoCall" component={VideoCallScreen} />
  </Stack.Navigator>
);

// --- 4. FLUXO TABS PSICÓLOGO ---
const TherapistTabNavigator = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5', // Indigo para médico
        tabBarInactiveTintColor: isDark ? '#64748B' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: isDark ? '#161E2E' : '#FFFFFF',
          borderTopColor: isDark ? '#1E293B' : '#F1F5F9',
          borderTopWidth: 1.5,
          height: 60,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'TherapistDashboard') return <BarChart3 color={color} size={size} />;
          if (route.name === 'TherapistAgenda') return <Calendar color={color} size={size} />;
          if (route.name === 'TherapistPatients') return <Users color={color} size={size} />;
          if (route.name === 'TherapistFinancial') return <CreditCard color={color} size={size} />;
          return <Settings color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="TherapistDashboard" component={TherapistDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="TherapistAgenda" component={TherapistAgendaScreen} options={{ title: 'Agenda' }} />
      <Tab.Screen name="TherapistPatients" component={TherapistPatientsScreen} options={{ title: 'Pacientes' }} />
      <Tab.Screen name="TherapistFinancial" component={TherapistFinancialScreen} options={{ title: 'Financeiro' }} />
      <Tab.Screen name="TherapistSettings" component={PatientSettingsScreen} options={{ title: 'Ajustes' }} />
    </Tab.Navigator>
  );
};

// --- 5. FLUXO COMPLETO PSICÓLOGO (TABS + TELAS INTERNAS) ---
export const TherapistNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TherapistTabs" component={TherapistTabNavigator} />
    <Stack.Screen name="MedicalRecordEdit" component={MedicalRecordEditScreen} />
    <Stack.Screen name="VideoCall" component={VideoCallScreen} />
  </Stack.Navigator>
);

// --- 6. FLUXO ADMINISTRADOR ---
export const AdminNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
  </Stack.Navigator>
);

// --- 7. NAVEGADOR PRINCIPAL (ROOT NAVIGATOR) ---
export const RootNavigator = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated || !user) {
    return <AuthNavigator />;
  }

  // Chaves de rotas automáticas baseadas em permissões
  switch (user.role) {
    case 'therapist':
      return <TherapistNavigator />;
    case 'admin':
      return <AdminNavigator />;
    case 'patient':
    default:
      return <PatientNavigator />;
  }
};
