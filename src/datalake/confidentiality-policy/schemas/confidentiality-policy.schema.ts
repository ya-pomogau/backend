import { Document } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ConfidentialityPolicyInterface } from '../../../common/types/confidentiality-policy.types';

@Schema({ timestamps: true })
export class ConfidentialityPolicy extends Document implements ConfidentialityPolicyInterface {
  text: string;

  title: string;
}

export const ConfidentialityPolicySchema =
  SchemaFactory.createForClass<ConfidentialityPolicyInterface>(ConfidentialityPolicy);
