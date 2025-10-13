import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ChatsController } from 'src/chats/chats.controller';
import { ChatsModel } from 'src/chats/entity/chat.entity';
import { MessagesController } from 'src/chats/messages/messages.controller';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { MessagesModel } from './messages/entity/messages.entity';
import { MessagesService } from './messages/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatsModel, MessagesModel]),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsGateway, ChatsService, MessagesService],
})
export class ChatsModule {}
