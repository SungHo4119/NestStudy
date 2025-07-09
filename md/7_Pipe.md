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

### ArgumentMetadata

- ArgumentMetadata는 파라미터에 대한 메타데이터를 포함하는 객체입니다.
- 각 파라미터에 대해 다음과 같은 정보를 제공합니다.
  - type: 파라미터의 유형 (예: body, query, param 등)
  - metatype: 파라미터의 메타타입 (예: DTO 클래스)
  - data: 파라미터의 이름 (예: 'id', 'email' 등)

## 스키마 기반 검증

### DTO(Data Transfer Object) 사용

```typescript
// DTO를 사용하여 스키마 기반 검증을 진행 할 수 있다.
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
// 검증

@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

- 위의 예제에서 `CreateCatDto` 클래스는 요청 데이터의 구조를 정의합니다. NestJS는 이 DTO를 사용하여 요청 데이터를 자동으로 검증하고 변환합니다.
- 해당 요청에 들어온 데이터가 DTO 구조인지 확인해야하지만 SRP(단일 책임 원칙)에 위배되므로 좋은 방법이 아닙니다.

## 객체 스키마 검증

- Zod 라이브러리를 사용하여 객체 스키마를 검증할 수 있습니다.

### 설치

```bash
npm install --save zod
```

- zod라이브러리를 사용하려면 `tsconfig.json` 파일에서 `strictNullChecks`에서 구성을 활성화 해야 합니다.

### Zod를 이용한 ValidationPipe 구현

```typescript
import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
```

### ZodSchema

- ZodSchema는 Zod 라이브러리에서 제공하는 스키마 정의 객체입니다. 이 객체를 사용하여 요청 데이터의 구조와 유효성을 정의할 수 있습니다.

```typescript
import { z } from 'zod';

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required();

export type CreateCatDto = z.infer<typeof createCatSchema>;
```

### 컨트롤러에서 사용 예시

```typescript
@Post()
@UsePipes(new ZodValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

## 클래스 기반 검증

- 클래스 기반 검증을 사용하면 DTO 클래스를 정의하고, 해당 클래스에 유효성 검사 데코레이터를 적용하여 요청 데이터를 검증할 수 있습니다.
- NestJS는 `class-validator` 라이브러리와 잘 호환되고 , 이를 통해 클래스 기반 유효성 검사를 쉽게 구현할 수 있습니다.

### 설치

```bash
 npm i --save class-validator class-transformer
```

### DTO 클래스 정의

import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
@IsString()
name: string;

@IsInt()
age: number;

@IsString()
breed: string;
}

### class-transformer, class-validator를 이용한 ValidationPipe 구현

```typescript
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

### 컨트롤러에서 사용 예시

```typescript

@Post()
async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto,
) {
  this.catsService.create(createCatDto);
}

```

## GlobalPipes

- GlobalPipes를 사용하면 애플리케이션 전체에서 공통적으로 적용되는 파이프를 설정할 수 있습니다.

### 예시 ( main.ts 파일에서 설정 )

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```
