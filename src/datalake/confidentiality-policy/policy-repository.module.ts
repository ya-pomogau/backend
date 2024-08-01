import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicyRepository } from './policy.repository';
import {
  ConfidentialityPolicy,
  ConfidentialityPolicySchema,
} from './schemas/confidentiality-policy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConfidentialityPolicy.name, schema: ConfidentialityPolicySchema },
    ]),
  ],
  providers: [PolicyRepository],
  exports: [PolicyRepository],
})
export class PolicyRepositoryModule {}
