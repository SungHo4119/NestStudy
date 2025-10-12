import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from 'src/chats/dto/create-chat.dto';
import { EnterChatDto } from 'src/chats/dto/enter-chat.dto';
import { CreateMessagesDto } from 'src/chats/messages/dto/create-messages.dto';
import { MessagesService } from 'src/chats/messages/messages.service';
import { CommonService } from 'src/common/common.service';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  namespace: '/chats',
})
export class ChatsGateway {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly commonService: CommonService,
    private readonly messagesService: MessagesService,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  @SubscribeMessage('create_chat')
  async createChat(@MessageBody() data: CreateChatDto) {
    await this.chatsService.CreateChat(data);
  }

  @SubscribeMessage('enter_chat')
  // 방의 chat ID들을 리스트로 받는다.
  async enterChat(
    @MessageBody() dto: EnterChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    for (const chatId of dto.chatIds) {
      const exists = await this.chatsService.checkIfChatExists(chatId);
      if (!exists) {
        throw new WsException({
          message: `존재하지 않는 chat 입니다. chatId: ${chatId}`,
        });
      }
    }
    socket.join(dto.chatIds.map((id) => id.toString()));
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket,
  ) {
    // 클라이언트로부터 메시지를 받으면 모든 클라이언트에게 아래 메시지를 전송
    // this.server.emit('receive_message', `${message.message} hello from server`);

    // 특정 방에만 메시지를 전송(In)
    // this.server
    //   .in(message.chatId.toString())
    //   .emit('receive_message', `${message.message}`);

    // Message를 보낸 클라이언트를 제외한 나머지 클라이언트에게 메시지를 전송
    // socket.to(dto.chatId.toString()).emit('receive_message', `${dto.message}`);

    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);

    if (!chatExists) {
      throw new WsException(`존재하지 않는 chat 입니다. chatId: ${dto.chatId}`);
    }

    const message = await this.messagesService.createMessage(dto);

    socket
      .to(message!.chat.id.toString())
      .emit('receive_message', `${dto.message}`);
  }
}
