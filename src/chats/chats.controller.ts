import { Controller, Get, Query } from '@nestjs/common';
import { ChatsService } from 'src/chats/chats.service';
import { PaginateChatDto } from 'src/chats/dto/paginate-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async paginateChat(@Query() dto: PaginateChatDto) {
    return this.chatsService.paginateChats(dto);
  }
}
