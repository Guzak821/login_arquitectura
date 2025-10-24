// src/external-api-mock/external-api-mock.module.ts

import { Module } from '@nestjs/common';
import { ExternalApiMockController } from './external-api-controller';

@Module({
  imports: [],
  controllers: [ExternalApiMockController],
  providers: [],
})
export class ExternalApiMockModule {}