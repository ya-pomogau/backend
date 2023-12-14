import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfidentialityPolicyRepository } from './confidentiality-policy.repository';
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
  providers: [ConfidentialityPolicyRepository],
  exports: [ConfidentialityPolicyRepository],
})
export class ConfidentialityPolicyModule {}
