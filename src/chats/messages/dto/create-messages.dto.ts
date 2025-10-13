import { PickType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { MessagesModel } from 'src/chats/messages/entity/messages.entity';
import { numberValidationMessage } from 'src/common/validation-message/number-validation.message';

export class CreateMessagesDto extends PickType(MessagesModel, ['message']) {
  @IsNumber({}, { message: numberValidationMessage })
  chatId: number;
}
