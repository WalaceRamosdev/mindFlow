import { Payment, PaymentMethod } from '../../domain/entities';

export interface PaymentIntentResponse {
  success: boolean;
  transactionId: string;
  pixQrCode?: string;
  pixExpiration?: string;
  invoiceUrl?: string;
}

export class PaymentService {
  /**
   * Cria um pagamento simulado via Stripe ou Mercado Pago
   */
  static async createPaymentIntent(
    amount: number,
    method: PaymentMethod,
    patientId: string,
    appointmentId?: string
  ): Promise<PaymentIntentResponse> {
    // Simula tempo de rede
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const transactionId = `tx_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    if (method === 'pix') {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1); // Expira em 1 hora

      // Retorna resposta contendo Copia e Cola simulado do PIX
      return {
        success: true,
        transactionId,
        pixQrCode: `00020101021226830014br.gov.bcb.pix2561api.pix.mindflow.com/v2/${transactionId}5204000053039865405${amount.toFixed(2)}5802BR5915MindFlowApp6009SaoPaulo62070503***6304D1A4`,
        pixExpiration: expirationDate.toISOString(),
      };
    }

    // Cartão de crédito / Boleto
    return {
      success: true,
      transactionId,
      invoiceUrl: `https://mindflow.com/receipts/${transactionId}.pdf`,
    };
  }

  /**
   * Assinatura mensal do paciente
   */
  static async processMonthlySubscription(patientId: string, creditCardToken: string): Promise<{ success: boolean; subscriptionId: string }> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const subscriptionId = `sub_${Math.random().toString(36).substring(2, 11)}`;
    return {
      success: true,
      subscriptionId,
    };
  }
}
