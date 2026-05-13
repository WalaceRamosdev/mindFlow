import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar o comportamento das notificações quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class PushNotificationService {
  /**
   * Solicita permissão e retorna o Token de Notificação do dispositivo
   */
  static async registerForPushNotificationsAsync(): Promise<string | undefined> {
    if (Platform.OS === 'web') return undefined;

    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Falha ao obter permissão para Push Notifications!');
      return undefined;
    }

    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } catch (error) {
      console.warn('Erro ao obter token do Expo Push Notification:', error);
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0D9488',
      });
    }

    return token;
  }

  /**
   * Agenda uma notificação de lembrete local para uma consulta específica
   */
  static async scheduleAppointmentReminder(appointmentId: string, title: string, body: string, triggerDate: Date): Promise<string> {
    const trigger = new Date(triggerDate);
    // Para fins de teste, se a data já passou, dispara em 10 segundos
    if (trigger.getTime() <= Date.now()) {
      trigger.setTime(Date.now() + 10000);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: { appointmentId },
      },
      trigger,
    });

    return notificationId;
  }

  /**
   * Cancela uma notificação agendada
   */
  static async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}
