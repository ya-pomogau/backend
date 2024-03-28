import { Injectable } from '@nestjs/common';
import { PolicyRepository } from '../../datalake/confidentiality-policy/policy.repository';
import { ConfidentialityPolicyInterface } from '../../common/types/confidentiality-policy.types';

@Injectable()
export class PolicyService {
  constructor(private readonly policyRepo: PolicyRepository) {}

  public async update(dto: ConfidentialityPolicyInterface) {
    return this.policyRepo.create({ ...dto });
  }

  public async getActual(): Promise<ConfidentialityPolicyInterface> {
    return this.policyRepo.findOne({}, {}, { sort: { createdAt: -1 } });
  }
}
