import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessagesDto } from 'src/chats/messages/dto/create-messages.dto';
import { PaginateMessagesDto } from 'src/chats/messages/dto/paginate-message.dto';
import { MessagesModel } from 'src/chats/messages/entity/messages.entity';
import { CommonService } from 'src/common/common.service';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messagesRepository: Repository<MessagesModel>,
    private readonly commonService: CommonService,
  ) {}

  async createMessage(dto: CreateMessagesDto, authorId: number) {
    const message = await this.messagesRepository.save({
      chat: {
        id: dto.chatId,
      },
      author: {
        id: authorId,
      },

      message: dto.message,
    });

    return this.messagesRepository.findOne({
      relations: {
        chat: true,
      },
      where: { id: message.id },
    });
  }

  async paginateMessages(
    dto: PaginateMessagesDto,
    overrideFindOption: FindManyOptions<MessagesModel>,
  ) {
    return this.commonService.paginate(
      dto,
      this.messagesRepository,
      overrideFindOption,
      'messages',
    );
  }
}
