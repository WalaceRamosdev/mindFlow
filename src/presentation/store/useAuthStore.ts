import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { User, UserRole } from '../../domain/entities';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  biometricSupported: boolean;
  
  // Ações
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (fullName: string, email: string, password: string, role: UserRole, crp?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  checkPersistedSession: () => Promise<void>;
  enableBiometrics: () => Promise<boolean>;
  authenticateWithBiometrics: () => Promise<boolean>;
}

// Mock inicial de usuários cadastrados para simular o backend
const MOCK_PATIENT: User = {
  id: 'usr_patient_01',
  email: 'paciente@mindflow.com',
  fullName: 'Gabriel Vasconcelos',
  role: 'patient',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  phoneNumber: '(11) 98765-4321',
  biometricEnabled: false,
  themePreference: 'light',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const MOCK_THERAPIST: User = {
  id: 'usr_therapist_01',
  email: 'terapeuta@mindflow.com',
  fullName: 'Dr. Arthur Mendes',
  role: 'therapist',
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
  phoneNumber: '(11) 91234-5678',
  biometricEnabled: false,
  themePreference: 'light',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const SECURE_TOKEN_KEY = 'mindflow_auth_token';
const SECURE_USER_KEY = 'mindflow_user_profile';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  biometricSupported: false,

  login: async (email, password, forcedRole) => {
    set({ isLoading: true, error: null });
    try {
      // Simula validação e latência
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Credenciais padrão de teste
      let selectedUser = MOCK_PATIENT;
      if (email.includes('psico') || email.includes('terapeuta') || forcedRole === 'therapist') {
        selectedUser = MOCK_THERAPIST;
      } else if (email.includes('admin') || forcedRole === 'admin') {
        selectedUser = {
          ...MOCK_PATIENT,
          id: 'usr_admin_01',
          fullName: 'Administrador Geral',
          role: 'admin',
          email: 'admin@mindflow.com'
        };
      }

      const dummyToken = `jwt_${Math.random().toString(36).substring(2, 20)}`;

      // Persistir na memória segura do dispositivo
      await SecureStore.setItemAsync(SECURE_TOKEN_KEY, dummyToken);
      await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(selectedUser));

      set({
        user: selectedUser,
        token: dummyToken,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Erro ao efetuar login', isLoading: false });
      return false;
    }
  },

  register: async (fullName, email, password, role, crp) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newUser: User = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email,
        fullName,
        role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D9488&color=fff`,
        biometricEnabled: false,
        themePreference: 'light',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const dummyToken = `jwt_${Math.random().toString(36).substring(2, 20)}`;

      await SecureStore.setItemAsync(SECURE_TOKEN_KEY, dummyToken);
      await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(newUser));

      set({
        user: newUser,
        token: dummyToken,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Erro ao realizar cadastro', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
      await SecureStore.deleteItemAsync(SECURE_USER_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch {
      set({ isLoading: false });
    }
  },

  updateProfile: async (updates) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updated = { ...currentUser, ...updates, updatedAt: new Date().toISOString() };
    await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(updated));
    set({ user: updated });
  },

  checkPersistedSession: async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      set({ biometricSupported: hasHardware && isEnrolled });

      const token = await SecureStore.getItemAsync(SECURE_TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(SECURE_USER_KEY);

      if (token && userStr) {
        set({
          token,
          user: JSON.parse(userStr),
          isAuthenticated: true
        });
      }
    } catch (e) {
      console.warn('Erro ao restaurar sessão persistida:', e);
    }
  },

  enableBiometrics: async () => {
    const supported = get().biometricSupported;
    if (!supported) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirme sua identidade para ativar a biometria',
      cancelLabel: 'Cancelar',
    });

    if (result.success) {
      const currentUser = get().user;
      if (currentUser) {
        await get().updateProfile({ biometricEnabled: true });
        return true;
      }
    }
    return false;
  },

  authenticateWithBiometrics: async () => {
    const supported = get().biometricSupported;
    if (!supported) return false;

    const token = await SecureStore.getItemAsync(SECURE_TOKEN_KEY);
    const userStr = await SecureStore.getItemAsync(SECURE_USER_KEY);

    if (!token || !userStr) return false;

    const parsedUser = JSON.parse(userStr);
    if (!parsedUser.biometricEnabled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Acesse o MindFlow usando sua biometria',
      cancelLabel: 'Usar Senha',
    });

    if (result.success) {
      set({
        token,
        user: parsedUser,
        isAuthenticated: true
      });
      return true;
    }

    return false;
  }
}));
