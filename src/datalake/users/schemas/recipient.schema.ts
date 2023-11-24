import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserStatus } from '../../../users/types';
import { PointGeoJSON, PointGeoJSONSchema } from '../../../common/schemas/PointGeoJSON.schema';

@Schema()
export class Recipient extends Document {
  @Prop({
    required: true,
    type: SchemaTypes.String,
    enum: ['Unconfirmed', 'Confirmed', 'Verified', 'Activated'],
  })
  status: UserStatus;

  @Prop({
    required: true,
    type: PointGeoJSONSchema,
    index: '2dsphere',
  })
  location: PointGeoJSON;
}

export const RecipientUserSchema = SchemaFactory.createForClass(Recipient);
