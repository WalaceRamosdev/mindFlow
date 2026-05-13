# 🧠 MindFlow — Sistema Premium de Teleconsulta Psicológica

O **MindFlow** é um aplicativo mobile completo e de alto desempenho projetado sob medida para psicologia clínica e agendamento de consultas em tempo real. Ele conecta psicólogos e pacientes através de uma interface elegante, moderna, minimalista e de alta performance, projetada para maximizar a conversão e a retenção de pacientes.

Desenvolvido sob os pilares da **Clean Architecture** (Arquitetura Limpa) e **Atomic Design** (Design Atômico), o projeto é altamente modular, escalável, totalmente tipado em TypeScript, compatível com a LGPD e pronto para produção nas plataformas iOS e Android.

---

## 🎨 Design System & Experiência Premium

A interface visual do MindFlow foi projetada para transmitir **tranquilidade, segurança e profissionalismo**:
- **Cores Sofisticadas (HSL/Hex)**:
  - `brand-primary` (`#0D9488` - Teal Terapêutico): Representa equilíbrio mental e cura emocional.
  - `brand-secondary` (`#4F46E5` - Indigo Clínico): Representa estabilidade, segurança e confiança médica.
  - `brand-accent` (`#8B5CF6` - Violeta Premium): Elementos VIP, planos recorrentes e gatilhos de conversão.
- **Micro-animações & Profundidade**: Uso de gradientes de cor sutis, sombras suaves e cards arredondados que reagem interativamente ao toque físico.
- **Suporte Nativo a Modo Escuro (Dark Mode)**: Cores escuras profundas (`#0B0F19`) e amigáveis para consultas noturnas ou situações de fadiga visual.
- **Feedback Constante**: Loaders discretos em botões, skeletons de carregamento progressivo e estados vazios (empty states) polidos.

---

## 🛠️ Arquitetura de Pastas (Clean & Atomic)

```
/src
  /domain               # Camada Pura de Regras de Negócio e Tipagem (Enterprise Core)
    /entities           # Entidades centrais do sistema (User, Patient, Therapist, Appointment, Message)
    /interfaces         # Contratos e definições abstratas de repositórios
  /infrastructure       # Camada de Integração Física com Serviços e Dados (Frameworks & Drivers)
    /database           # Scripts de criação SQL, relacionamentos, chaves e políticas RLS
    /supabase           # Inicialização e clientes de banco de dados e autenticação
    /services           # Serviços e Mocks de terceiros (Stripe, Mercado Pago, Agora WebRTC, Notifications)
  /presentation         # Camada Física de Interface Visual com o Usuário (UI View Layer)
    /components         # Componentização baseada em Atomic Design
      /atoms            # Componentes indivisíveis (Button, Input, Typography, Badge, Avatar)
      /molecules        # Elementos compostos (Card, ChatBubble, Toast)
      /organisms        # Estruturas complexas (Filtros de busca, AgendaCalendar, VideoCallOverlay)
    /screens            # Telas visuais separadas por domínios de navegação
      /auth             # Splash, Onboarding, ProfileSelection, Login, Registro, Recuperação de Senha
      /patient          # Home, Search, TherapistProfile, BookAppointment, Chat, Wallet, Settings
      /therapist        # Dashboard, Agenda, Patients, MedicalRecordEdit, Financial
      /admin            # AdminDashboard (Aprovação de CRPs de médicos e métricas em lote)
    /navigation         # Configuração de rotas de navegação (Tab Bar, Stacks e route types estritos)
    /store              # Gerenciamento de Estado com Zustand e persistência offline (AsyncStorage)
```

---

## 🔒 Segurança, LGPD & Recursos Clínicos

1. **Prontuário Confidencial Criptografado (CFM/LGPD)**: O módulo de evolução clínica (`MedicalRecordEditScreen`) possui acesso restrito e seguro. Apenas o psicólogo titular de CRP cadastrado pode ler ou alterar as evoluções clínicas do paciente.
2. **Assinatura Digital de Documentos**: Geração automática de chaves e hashes criptográficos SHA-256 no momento em que o psicólogo salva e assina a evolução da sessão do paciente, garantindo integridade ética e jurídica de laudos e receitas.
3. **Autenticação Segura & Biometria**: Integração com `Expo Local Authentication` para logins por Face ID e Touch ID, e armazenamento de chaves de sessão JWT em memória persistente criptografada através do `Expo Secure Store`.
4. **Offline First**: Sincronização inteligente de dados globais (Zustand) com o `AsyncStorage` garantindo que agendamentos e mensagens do chat possam ser lidos mesmo sem conexão de rede ativa.

---

## ⚡ Guia de Inicialização e Execução Rápida

Siga os passos abaixo para instalar e rodar o projeto localmente:

### 1. Pré-requisitos
Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado em sua máquina de desenvolvimento.

### 2. Clonar e Instalar Dependências
```bash
# Entre na pasta do projeto
cd "Aplicativo para psicologos"

# Instale os pacotes de forma automatizada
npm install
```

### 3. Configurar Variáveis de Ambiente
Duplique o arquivo `.env.example`, mude o nome para `.env` e configure suas credenciais de desenvolvimento do Supabase, Stripe e Agora.io:
```bash
cp .env.example .env
```

### 4. Importar o Banco de Dados (Supabase/PostgreSQL)
Abra a aba **SQL Editor** no painel administrativo do seu projeto no Supabase e cole o conteúdo completo do arquivo localizado em:
👉 `src/infrastructure/database/schema.sql`

Este script criará:
- Tabelas relacionais (usuários, psicólogos, pacientes, consultas, prontuários, faturamentos, mensagens, etc.) com índices otimizados para alto desempenho de busca.
- Políticas de Segurança **RLS (Row Level Security)** que protegem os dados clínicos de acessos maliciosos de terceiros.
- Triggers de PostgreSQL que criam perfis de pacientes e psicólogos na tabela pública de forma automática no momento de novos cadastros de e-mail na área Auth do Supabase.

### 5. Executar o Aplicativo
```bash
# Iniciar o Expo Dev Server
npm run start

# Ou abrir diretamente no simulador específico de sua preferência
npm run android # Para simulador Android
npm run ios     # Para simulador iOS
```

Use o aplicativo **Expo Go** em seu celular físico para escanear o QR Code gerado no terminal e navegar pela experiência completa premium em tempo real!
