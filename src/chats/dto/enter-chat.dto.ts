import { IsNumber } from 'class-validator';
import { numberValidationMessage } from 'src/common/validation-message/number-validation.message';

export class EnterChatDto {
  @IsNumber({}, { message: numberValidationMessage, each: true })
  chatIds: number[];
}
