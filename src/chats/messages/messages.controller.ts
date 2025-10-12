import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MessagesService } from 'src/chats/messages/messages.service';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

@Controller('/chats/:cid/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async paginateMessages(
    @Param('cid', ParseIntPipe) cid: number,
    @Query() dto: BasePaginationDto,
  ) {
    return await this.messagesService.paginateMessages(dto, {
      relations: {
        chat: true,
        author: true,
      },
      where: { chat: { id: cid } },
    });
  }
}
