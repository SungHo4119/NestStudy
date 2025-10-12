import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsController } from 'src/chats/chats.controller';
import { ChatsModel } from 'src/chats/entities/chat.entity';
import { MessagesController } from 'src/chats/messages/messages.controller';
import { CommonModule } from 'src/common/common.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { MessagesModel } from './messages/entity/messages.entity';
import { MessagesService } from './messages/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatsModel, MessagesModel]),
    CommonModule,
  ],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsGateway, ChatsService, MessagesService],
})
export class ChatsModule {}
