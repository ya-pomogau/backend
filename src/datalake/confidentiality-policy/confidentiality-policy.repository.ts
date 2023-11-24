import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryService } from '../base-repository/base-repository.service';
import { ConfidentialityPolicy } from './schemas/confidentiality-policy.schema';

@Injectable()
export class ConfidentialityPolicyRepository extends BaseRepositoryService<ConfidentialityPolicy> {
  constructor(
    @InjectModel(ConfidentialityPolicy.name)
    private readonly confidentialityPolicyModel: Model<ConfidentialityPolicy>
  ) {
    super(confidentialityPolicyModel);
  }
}
