import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { HashService } from './hash.service';

@Module({
  providers: [HashService],
  imports: [ConfigModule.forRoot()],
  exports: [HashService],
})
export class HashModule {}
