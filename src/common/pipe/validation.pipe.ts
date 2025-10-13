import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export class SocketValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      ...options, // Allow overriding default options if needed
    });
  }
}
