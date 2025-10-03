import { ValidationArguments } from 'class-validator';

export const inValidationMessage = (args: ValidationArguments) => {
  if (args.constraints.length === 1) {
    return `${args.property}는 ${args.constraints[0]}이어야 합니다.`;
  }

  return `${args.property}는 ${args.constraints.join(', ')} 중 하나여야 합니다.`;
};
