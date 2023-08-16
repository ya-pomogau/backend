import { Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [HashService],
  imports: [ConfigModule.forRoot()],
  exports: [HashService],
})
export class HashModule {}
