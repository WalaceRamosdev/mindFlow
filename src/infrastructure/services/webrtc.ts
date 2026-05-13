export interface VideoCallSession {
  roomId: string;
  token: string;
  localUserId: string;
  peerUserId?: string;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
}

export class VideoCallService {
  /**
   * Inicializa uma sala de videochamada WebRTC (Simulando Integração Agora / Twilio)
   */
  static async createVideoRoom(appointmentId: string): Promise<VideoCallSession> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    return {
      roomId: `room_${appointmentId}`,
      token: `rtc_token_${Math.random().toString(36).substring(2, 12)}`,
      localUserId: Math.random().toString(36).substring(2, 6),
      isAudioMuted: false,
      isVideoMuted: false,
    };
  }

  /**
   * Envia evento para o servidor para fechar a chamada
   */
  static async endCall(roomId: string): Promise<boolean> {
    // Comunicação WebSocket ou API REST para fechar canais e canais WebRTC
    return true;
  }
}
