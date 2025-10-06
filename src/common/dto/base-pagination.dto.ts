import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { OrderBy } from 'src/common/type/pagination.type';
import { inValidationMessage } from 'src/common/validation-message/in-validation.message';
import { numberValidationMessage } from 'src/common/validation-message/number-validation.message';

export class BasePaginationDto {
  @IsNumber(undefined, { message: numberValidationMessage })
  @IsOptional()
  page?: number;

  // @Type(() => Number)
  @IsNumber(undefined, { message: numberValidationMessage })
  @IsOptional()
  where__id__more_than?: number;

  @IsNumber(undefined, { message: numberValidationMessage })
  @IsOptional()
  where__id__less_than?: number;

  @IsIn([OrderBy.ASC, OrderBy.DESC], { message: inValidationMessage })
  @IsOptional()
  order__createdAt?: OrderBy = OrderBy.ASC;

  // @Type(() => Number)
  @IsNumber(undefined, { message: numberValidationMessage })
  @IsOptional()
  take: number = 20;
}
