-- ==========================================
-- MINDFLOW DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- ==========================================
-- Este arquivo contém o esquema de banco de dados para o aplicativo MindFlow,
-- incluindo tabelas, chaves estrangeiras, índices de desempenho,
-- políticas de segurança RLS (Row Level Security) e triggers para realtime.

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. ENUMS E TIPOS CUSTOMIZADOS
-- ==========================================
CREATE TYPE user_role AS ENUM ('patient', 'therapist', 'admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'canceled', 'completed', 'rescheduled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('pix', 'credit_card', 'boleto');
CREATE TYPE document_type AS ENUM ('prescription', 'certificate', 'receipt', 'report');

-- ==========================================
-- 2. TABELA DE USUÁRIOS (PERFIS COMPARTILHADOS)
-- ==========================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    avatar_url TEXT,
    phone_number VARCHAR(20),
    biometric_enabled BOOLEAN DEFAULT FALSE,
    theme_preference VARCHAR(10) DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. TABELA DE PSICÓLOGOS
-- ==========================================
CREATE TABLE public.therapists (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    crp VARCHAR(50) UNIQUE NOT NULL, -- Registro Profissional
    bio TEXT NOT NULL,
    specialties TEXT[] NOT NULL, -- Especialidades médicas (e.g., TCC, Ansiedade, Depressão)
    price_per_session DECIMAL(10, 2) NOT NULL,
    years_of_experience INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    is_approved BOOLEAN DEFAULT FALSE, -- Controle de aprovação pelo Painel Admin
    google_calendar_connected BOOLEAN DEFAULT FALSE,
    apple_calendar_connected BOOLEAN DEFAULT FALSE,
    digital_signature_url TEXT, -- Assinatura digital cadastrada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. TABELA DE PACIENTES
-- ==========================================
CREATE TABLE public.patients (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    cpf VARCHAR(14) UNIQUE,
    birth_date DATE,
    emergency_contact VARCHAR(255),
    notes TEXT, -- Observações gerais (não confidenciais)
    is_subscribed BOOLEAN DEFAULT FALSE, -- Assinatura mensal ativa
    subscription_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. TABELA DE ESPECIALIDADES (AUXILIAR DE BUSCA)
-- ==========================================
CREATE TABLE public.specialties (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir especialidades padrão para o aplicativo
INSERT INTO public.specialties (name, description) VALUES
('Terapia Cognitivo-Comportamental (TCC)', 'Focada em reestruturação de padrões de pensamento e comportamentos.'),
('Psicanálise', 'Exploração do inconsciente, traumas passados e autoconhecimento profundo.'),
('Terapia de Casal', 'Mediação e fortalecimento de relacionamentos afetivos.'),
('Ansiedade e Depressão', 'Tratamento específico para transtornos de humor e síndromes ansiosas.'),
('Terapia Infantil / Ludoterapia', 'Apoio psicológico infantil por meio de jogos e dinâmicas lúdicas.'),
('Terapia Organizacional', 'Desenvolvimento de carreira, estresse ocupacional e burnout.');

-- ==========================================
-- 6. TABELA DE DISPONIBILIDADE E AGENDA DO PSICÓLOGO
-- ==========================================
CREATE TABLE public.availabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL, -- 0 (Domingo) a 6 (Sábado)
    start_time TIME NOT NULL, -- e.g., '08:00:00'
    end_time TIME NOT NULL,   -- e.g., '12:00:00'
    is_blocked BOOLEAN DEFAULT FALSE, -- Permite o psicólogo bloquear blocos específicos temporariamente
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (therapist_id, day_of_week, start_time, end_time)
);

-- ==========================================
-- 7. TABELA DE CONSULTAS (AGENDAMENTOS)
-- ==========================================
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE RESTRICT,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL, -- Data e Hora da consulta (salva em UTC)
    duration_minutes INT DEFAULT 50,
    status appointment_status DEFAULT 'pending',
    cancellation_reason TEXT,
    video_room_id VARCHAR(100), -- ID do canal WebRTC (Agora/Twilio) para a consulta
    rating_score INT CHECK (rating_score BETWEEN 1 AND 5), -- Avaliação feita pelo paciente pós-consulta
    rating_comment TEXT,
    google_event_id VARCHAR(255),
    apple_event_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 8. TABELA DE PRONTUÁRIOS E EVOLUÇÕES CLÍNICAS (ALTAMENTE CONFIDENCIAL)
-- ==========================================
CREATE TABLE public.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID UNIQUE NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    evolution_text TEXT NOT NULL, -- Notas do psicólogo sobre o progresso (Criptografado)
    diagnosis_code VARCHAR(10), -- CID-10 opcional para fins de laudos
    private_notes TEXT, -- Anotações pessoais de rascunho do psicólogo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 9. TABELA DE DOCUMENTOS E RECEITAS (ASSINADOS DIGITALMENTE)
-- ==========================================
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    type document_type NOT NULL,
    file_url TEXT NOT NULL, -- Caminho do PDF armazenado no Storage
    is_signed BOOLEAN DEFAULT FALSE,
    digital_signature_hash TEXT, -- Assinatura criptográfica que valida o documento
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 10. TABELA DE PAGAMENTOS E FATURAMENTO
-- ==========================================
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    amount DECIMAL(10, 2) NOT NULL,
    status payment_status DEFAULT 'pending',
    method payment_method NOT NULL,
    transaction_id VARCHAR(255), -- ID de transação do Stripe / Mercado Pago
    pix_qr_code TEXT, -- Conteúdo Copia e Cola / Base64 para PIX
    pix_expiration TIMESTAMP WITH TIME ZONE,
    invoice_url TEXT, -- URL para recibo emitido pelo Stripe/Mercado Pago
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 11. TABELA DE MENSAGENS DO CHAT (REALTIME)
-- ==========================================
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT, -- Conteúdo textual da mensagem
    attachment_url TEXT, -- Caminho de PDFs/Imagens/Áudios anexados no Storage
    attachment_type VARCHAR(50), -- 'image', 'pdf', 'audio'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 12. TABELA DE NOTIFICAÇÕES (PUSH & APP)
-- ==========================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'appointment_reminder', 'payment_success', 'chat_message', etc.
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB, -- Dados extras para deep linking no app
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 13. ÍNDICES DE DESEMPENHO (OTIMIZAÇÃO DE BUSCA)
-- ==========================================
-- Busca rápida de psicólogos por CRP e especialidade
CREATE INDEX idx_therapists_crp ON public.therapists(crp);
CREATE INDEX idx_therapists_is_approved ON public.therapists(is_approved) WHERE is_approved = TRUE;

-- Busca rápida de consultas futuras/passadas por usuário e data
CREATE INDEX idx_appointments_patient_time ON public.appointments(patient_id, scheduled_time DESC);
CREATE INDEX idx_appointments_therapist_time ON public.appointments(therapist_id, scheduled_time DESC);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- Desempenho crítico de chat realtime (mensagens ordenadas por criação)
CREATE INDEX idx_messages_chat_flow ON public.messages(sender_id, receiver_id, created_at ASC);
CREATE INDEX idx_messages_unread ON public.messages(receiver_id) WHERE is_read = FALSE;

-- Busca de disponibilidade ativa
CREATE INDEX idx_availabilities_therapist ON public.availabilities(therapist_id, day_of_week);

-- Busca rápida de prontuários por paciente
CREATE INDEX idx_medical_records_patient ON public.medical_records(patient_id);

-- Notificações não lidas
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE is_read = FALSE;

-- ==========================================
-- 14. POLÍTICAS DE SEGURANÇA RLS (ROW LEVEL SECURITY)
-- ==========================================
-- Habilitar RLS em todas as tabelas clínicas e confidenciais
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Exemplo 1: Políticas de Usuários
CREATE POLICY "Qualquer um pode ver perfis públicos"
    ON public.users FOR SELECT USING (true);

CREATE POLICY "Usuários só editam seu próprio perfil"
    ON public.users FOR UPDATE USING (auth.uid() = id);

-- Exemplo 2: Políticas de Psicólogos (Perfis públicos)
CREATE POLICY "Qualquer um pode ver psicólogos aprovados"
    ON public.therapists FOR SELECT USING (is_approved = true OR auth.uid() = id);

CREATE POLICY "Psicólogos só atualizam seu próprio perfil"
    ON public.therapists FOR UPDATE USING (auth.uid() = id);

-- Exemplo 3: Políticas de Consultas (Pacientes e Psicólogos vinculados)
CREATE POLICY "Leitura de consultas autorizada apenas para os envolvidos"
    ON public.appointments FOR SELECT
    USING (auth.uid() = patient_id OR auth.uid() = therapist_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Inserção de consulta autorizada para paciente logado"
    ON public.appointments FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Atualização de consulta para envolvidos"
    ON public.appointments FOR UPDATE
    USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

-- Exemplo 4: Políticas de Prontuários (Acesso extremamente restrito)
CREATE POLICY "Apenas o psicólogo que atendeu pode ver ou criar o prontuário"
    ON public.medical_records FOR ALL
    USING (auth.uid() = therapist_id);

-- Exemplo 5: Políticas do Chat (Mensagens)
CREATE POLICY "Usuário só lê mensagens que enviou ou recebeu"
    ON public.messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Usuário só envia mensagens como ele mesmo"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- ==========================================
-- 15. TRIGGERS E FUNÇÕES AUTOMÁTICAS
-- ==========================================

-- Trigger para atualizar automaticamente o campo updated_at ao modificar registros
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_therapists_updated_at BEFORE UPDATE ON public.therapists FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Função de trigger para sincronizar a tabela public.users automaticamente ao criar um login na auth.users do Supabase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, avatar_url, phone_number)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone_number'
  );

  -- Se for paciente, inicializa na tabela correspondente
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'patient') = 'patient' THEN
    INSERT INTO public.patients (id) VALUES (NEW.id);
  -- Se for psicólogo, inicializa pendente de aprovação
  ELSIF NEW.raw_user_meta_data->>'role' = 'therapist' THEN
    INSERT INTO public.therapists (id, crp, bio, specialties, price_per_session)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'crp', 'PENDENTE'),
      COALESCE(NEW.raw_user_meta_data->>'bio', 'Biografia em preenchimento.'),
      ARRAY[]::text[],
      COALESCE((NEW.raw_user_meta_data->>'price_per_session')::decimal, 150.00)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
