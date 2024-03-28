import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PolicyRepositoryModule } from '../../datalake/confidentiality-policy/policy-repository.module';

@Module({
  imports: [PolicyRepositoryModule],
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PolicyModule {}
