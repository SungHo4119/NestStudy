import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  /**
   * ValidationArguments의 프로퍼티
   * 1) value -> 검증 되고 있는 값 ( 입력된 값 )
   * 2) constraints -> 파라미터에 입력된 제한 사항들 (IsString의 경우 제약사항이 없음)
   *   -> args.constraints[0] = 1
   *   -> args.constraints[1] = 20
   * 3) targetName -> 검증하는 클래스의 이름 (UsersModel)
   * 4) object -> 검증하고 있는 객체
   * 5) property -> 검증 되고 있는 객체의 프로퍼티 이름 (nickname)
   */
  if (args.constraints.length === 2) {
    return `${args.property}는 ${args.constraints[0]}~${args.constraints[1]} 글자를 입력해야합니다.`;
  } else {
    return `${args.property}는 최소 ${args.constraints[0]}글자를 입력해야합니다.`;
  }
};
