import { UseFilters, UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { CreateChatDto } from 'src/chats/dto/create-chat.dto';
import { EnterChatDto } from 'src/chats/dto/enter-chat.dto';
import { CreateMessagesDto } from 'src/chats/messages/dto/create-messages.dto';
import { MessagesService } from 'src/chats/messages/messages.service';
import { SocketCatchHttpExceptionFilter } from 'src/common/exception-filter/socket.catch.http.exception-filter';
import { SocketValidationPipe } from 'src/common/pipe/validation.pipe';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { ChatsService } from './chats.service';

@UseFilters(SocketCatchHttpExceptionFilter)
@UsePipes(new SocketValidationPipe())
// Socket을 사용하는경우 Guard를 사용하여 인증을 처리할때의 문제점은
// 한번 Connectede된 이후에는 Headers변경이 불가능 하기 때문에 Guard를 사용한 경우 Access 인증이 만료되는 경우 문제가 발생한다.
// 한번 연결하는 경우 Access Token을 이용하여 인증을 처리하고 이후부터는 해당 소켓을 계속 이용하기 때문에 handleConnection에서 인증을 처리한다.
// @UseGuards(SocketBearerTokenGuard)
@WebSocketGateway({
  namespace: '/chats',
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @WebSocketServer()
  server: Server;

  // 클라이언트가 연결되었을 때 호출되는 메서드
  async handleConnection(socket: any) {
    try {
      console.log('handleConnection :' + socket.id);
      const headers = socket.handshake.headers;

      // Bearer xxxx
      const rawToken = headers['authorization'];

      if (!rawToken) {
        throw new WsException('토큰이 존재하지 않습니다.');
      }

      const token = this.authService.extractTokenFromHeader(rawToken, true);

      const payload = this.authService.verifyToken(token);

      const user = await this.userService.getUserByEmail(payload.email);

      if (!user) {
        throw new WsException('존재하지 않는 유저입니다.');
      }

      socket.user = user;
    } catch (error) {
      console.log(`connection error info: ${socket.id}-${error.message}`);
      socket.disconnect();
    }
  }

  // Gateway가 초기화된 후에 호출되는 메서드
  afterInit() {
    console.log(`after gateway init`);
  }

  // 클라이언트가 연결을 끊었을 때 호출되는 메서드
  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('create_chat')
  async createChat(@MessageBody() data: CreateChatDto) {
    await this.chatsService.CreateChat(data);
  }

  @SubscribeMessage('enter_chat')
  // 방의 chat ID들을 리스트로 받는다.
  async enterChat(
    @MessageBody() dto: EnterChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
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
    @ConnectedSocket() socket: Socket & { user: UsersModel },
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

    const message = await this.messagesService.createMessage(
      dto,
      socket.user.id,
    );

    socket
      .to(message!.chat.id.toString())
      .emit('receive_message', `${dto.message}`);
  }
}
