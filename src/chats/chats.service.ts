import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatDto } from 'src/chats/dto/create-chat.dto';
import { PaginateChatDto } from 'src/chats/dto/paginate-chat.dto';
import { ChatsModel } from 'src/chats/entities/chat.entity';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatsModel)
    private readonly chatRepository: Repository<ChatsModel>,

    private readonly commonService: CommonService,
  ) {}
  async paginateChats(dto: PaginateChatDto) {
    return this.commonService.paginate(
      dto,
      this.chatRepository,
      {
        relations: {
          users: true,
        },
      },
      'chats',
    );
  }

  async CreateChat(dto: CreateChatDto) {
    const chat = await this.chatRepository.save({
      users: dto.userIds.map((id) => ({ id })),
    });

    return this.chatRepository.findOne({
      where: { id: chat.id },
    });
  }

  async checkIfChatExists(chatId: number) {
    const exists = await this.chatRepository.exists({
      where: { id: chatId },
    });
    return exists;
  }
}
