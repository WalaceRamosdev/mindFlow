import { create } from 'zustand';
import { Payment, MedicalRecord, Document } from '../../domain/entities';

interface FinancialState {
  payments: Payment[];
  medicalRecords: Record<string, MedicalRecord[]>; // patientId -> MedicalRecords
  documents: Document[];
  isLoading: boolean;

  // Ações
  fetchPayments: (patientId: string) => Promise<void>;
  processPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<{ success: boolean; payment: Payment }>;
  addMedicalRecord: (appointmentId: string, patientId: string, therapistId: string, text: string, code?: string, notes?: string) => Promise<boolean>;
  signDocument: (documentId: string, signatureHash: string) => Promise<boolean>;
  fetchPatientMedicalRecords: (patientId: string) => Promise<MedicalRecord[]>;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay_01',
    appointmentId: 'apt_01',
    patientId: 'usr_patient_01',
    amount: 150.00,
    status: 'paid',
    method: 'credit_card',
    transactionId: 'tx_SUCC_39485',
    invoiceUrl: 'https://mindflow.com/receipts/tx_SUCC_39485.pdf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pay_02',
    appointmentId: 'apt_02',
    patientId: 'usr_patient_01',
    amount: 180.00,
    status: 'paid',
    method: 'pix',
    transactionId: 'tx_SUCC_11985',
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
  }
];

const MOCK_RECORDS: Record<string, MedicalRecord[]> = {
  'usr_patient_01': [
    {
      id: 'rec_01',
      appointmentId: 'apt_02',
      patientId: 'usr_patient_01',
      therapistId: 'usr_therapist_02',
      evolutionText: 'Paciente relata melhora expressiva nos picos de estresse no ambiente corporativo após iniciar as pausas programadas de atenção plena. Identificada necessidade de aprofundar os motivadores inconscientes da cobrança por performance na próxima sessão.',
      diagnosisCode: 'F41.1', // Ansiedade generalizada
      privateNotes: 'Aparenta ter boa inteligência emocional, mas é muito rígido consigo mesmo.',
      createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
    }
  ]
};

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc_01',
    patientId: 'usr_patient_01',
    therapistId: 'usr_therapist_02',
    title: 'Laudo Psicológico - Aptidão para Concurso',
    type: 'report',
    fileUrl: 'https://mindflow.com/docs/doc_01.pdf',
    isSigned: true,
    digitalSignatureHash: 'sha256:7b51f0923fbc062b146497cf87e596e1b6',
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
  }
];

export const useFinancialStore = create<FinancialState>((set, get) => ({
  payments: MOCK_PAYMENTS,
  medicalRecords: MOCK_RECORDS,
  documents: MOCK_DOCUMENTS,
  isLoading: false,

  fetchPayments: async (patientId) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ isLoading: false });
  },

  processPayment: async (paymentDetails) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newPayment: Payment = {
      ...paymentDetails,
      id: `pay_${Math.random().toString(36).substring(2, 9)}`,
      status: 'paid',
      transactionId: `tx_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    set((state) => ({
      payments: [newPayment, ...state.payments],
      isLoading: false
    }));

    return { success: true, payment: newPayment };
  },

  addMedicalRecord: async (appointmentId, patientId, therapistId, text, code, notes) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRecord: MedicalRecord = {
        id: `rec_${Math.random().toString(36).substring(2, 9)}`,
        appointmentId,
        patientId,
        therapistId,
        evolutionText: text,
        diagnosisCode: code,
        privateNotes: notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      set((state) => {
        const history = state.medicalRecords[patientId] || [];
        return {
          medicalRecords: {
            ...state.medicalRecords,
            [patientId]: [newRecord, ...history]
          },
          isLoading: false
        };
      });

      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  signDocument: async (documentId, signatureHash) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === documentId ? { ...doc, isSigned: true, digitalSignatureHash: signatureHash } : doc
      ),
      isLoading: false
    }));

    return true;
  },

  fetchPatientMedicalRecords: async (patientId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return get().medicalRecords[patientId] || [];
  }
}));
