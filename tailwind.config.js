/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0D9488",    // Teal - Equilíbrio, saúde mental, tranquilidade
          secondary: "#4F46E5",  // Indigo - Confiança, segurança, profissionalismo
          accent: "#8B5CF6",     // Violet - Toques premium, destaque e retenção
          success: "#10B981",    // Verde - Sucesso, pagamentos confirmados
          warning: "#F59E0B",    // Laranja - Alertas de horários, pendências
          danger: "#EF4444",     // Vermelho - Cancelamento de consulta, erros
          // Cores para tema Light
          lightBg: "#F8FAFC",    // Slate 50 - Fundo principal super limpo
          lightSurface: "#FFFFFF", // Branco puro para cards, listas
          lightText: "#1E293B",  // Slate 800 - Texto principal de alto contraste
          lightSubtext: "#64748B", // Slate 500 - Textos de apoio e labels
          // Cores para tema Dark (Próximo de Slate escuro e profundo)
          darkBg: "#0B0F19",     // Fundo escuro ultramoderno
          darkSurface: "#161E2E", // Cards escuros elegantes
          darkText: "#F1F5F9",   // Texto principal claro
          darkSubtext: "#94A3B8", // Textos de apoio escuro
        }
      }
    },
  },
  plugins: [],
}
