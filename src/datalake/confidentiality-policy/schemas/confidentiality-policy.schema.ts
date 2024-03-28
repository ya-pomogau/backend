import { Document, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ConfidentialityPolicyInterface } from '../../../common/types/confidentiality-policy.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class ConfidentialityPolicy extends Document implements ConfidentialityPolicyInterface {
  @Prop({ type: SchemaTypes.String, required: true })
  text: string;

  @Prop({ type: SchemaTypes.String, required: true })
  title: string;
}

export const ConfidentialityPolicySchema =
  SchemaFactory.createForClass<ConfidentialityPolicyInterface>(ConfidentialityPolicy);
