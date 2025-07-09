# Pipe

## 공식문서 링크 : https://docs.nestjs.com/pipes

## Pipe란?

- Pipe는 요청 데이터의 유효성을 검사하고 변환하는 데 사용되는 NestJS
  - 변환 : 입력 데이터를 원하는 형태로 변환합니다(예: 문자열에서 정수로)
  - 검증 : 입력 데이터를 평가하고 유효한 경우 변경하지 않고 그대로 전달합니다. 그렇지 않으면 예외를 발생시킵니다.
- Nest는 메서드가 호출되기 직전에 파이프를 실행하고 파이프는 해당 메서드로 전달되는 인수를 받아 처리합
- 모든 변환 또는 유효성 검사 작업은 파이프에서 수행되며 라우트 핸들러는 변환된 인수를 사용합니다.

## 기본 제공되는 내장 Pipe

### 패키지

- @nestjs/common

### 종류 및 설명

- ValidationPipe : 요청 데이터의 유효성을 검사하고 변환합니다. DTO와 함께 사용하여 유효성 검사 규칙을 정의할 수 있습니다.
- ParseIntPipe: 요청 데이터를 정수로 변환합니다. 문자열을 정수로 변환할 때 사용합니다.
- ParseFloatPipe: 요청 데이터를 부동 소수점 숫자로 변환합니다.
- ParseBoolPipe: 요청 데이터를 불리언 값으로 변환합니다.
- ParseArrayPipe: 요청 데이터를 배열로 변환합니다.
- ParseUUIDPipe: 요청 데이터를 UUID로 변환합니다.
- ParseEnumPipe: 요청 데이터를 열거형으로 변환합니다.
- DefaultValuePipe: 요청 데이터에 기본값을 설정합니다.
- ParseFilePipe: 요청 데이터를 파일로 변환합니다.
- ParseDatePipe: 요청 데이터를 날짜로 변환합니다.

## 예제

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

- 위의 예제에서 `ParseIntPipe`는 `id` 파라미터를 정수로 변환합니다. 만약 `id`가 정수가 아닌 경우, NestJS는 자동으로 예외를 발생시킵니다.

```Json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

## 커스텀 Pipe

- 커스텀 Pipe를 만들려면 `PipeTransform` 인터페이스를 구현해야 합니다. 이 인터페이스는 `transform` 메서드를 포함하고 있으며, 이 메서드는 입력 데이터를 처리하는 로직을 정의합니다.

### 예시

```typescript
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

// 사용방법 1) 정의한 Pipe를 @Body, @Query, @Param 등에 직접 적용할 수 있습니다.
@Body('password', PasswordPipe) password: string,
// 사용방법 2) constructor가 있는 Pipe는 new 키워드를 사용하여 인스턴스를 생성해야 합니다.
@Body('password', new MaxLengthPipe(8), new MinLengthPipe(4))
password: string,
...
```
