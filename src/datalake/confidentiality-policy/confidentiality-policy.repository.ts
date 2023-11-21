import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base-repository/base-repository.service';
import { ConfidentialityPolicy } from './schemas/confidentiality-policy.schema';

@Injectable()
export class ConfidentialityPolicyRepository extends BaseRepository<ConfidentialityPolicy> {}
