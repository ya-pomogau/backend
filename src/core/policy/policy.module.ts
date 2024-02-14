import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';

@Module({
  providers: [PolicyService],
})
export class PolicyModule {}
