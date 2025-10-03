import { ValidationArguments } from 'class-validator';

export const numberValidationMessage = (args: ValidationArguments) => {
  return `${args.property}는 숫자이어야 합니다.`;
};
