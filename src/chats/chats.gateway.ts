import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  namespace: '/chats',
})
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  @SubscribeMessage('send_message')
  sendMessage(@MessageBody() message: string) {
    // 클라이언트로부터 메시지를 받으면 모든 클라이언트에게 아래 메시지를 전송
    this.server.emit('receive_message', `${message} hello from server`);
  }
}
