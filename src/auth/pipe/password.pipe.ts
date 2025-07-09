import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  /**
   * Class 'PasswordPipe' incorrectly implements interface 'PipeTransform<any, any>'.
   * Property 'transform' is missing in type 'PasswordPipe' but required in type 'PipeTransform<any, any>'.ts(2420)
   * pipe-transform.interface.d.ts(41, 5): 'transform' is declared here.
   */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > 8) {
      throw new BadRequestException('비밀번호는 8자리 이하로 입력해주세요.');
    }
    return value;
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly maxLength: number) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > this.maxLength) {
      throw new BadRequestException(`최대 길이는 ${this.maxLength}입니다.`);
    }
    return value;
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly minLength: number) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length < this.minLength) {
      throw new BadRequestException(`최소 길이는 ${this.minLength}입니다.`);
    }

    return value;
  }
}
