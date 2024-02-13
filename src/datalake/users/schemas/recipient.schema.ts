import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { RecipientUserModelInterface, UserStatus } from '../../../common/types/user.types';
import { PointGeoJSON, PointGeoJSONSchema } from '../../../common/schemas/PointGeoJSON.schema';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class Recipient extends Document implements RecipientUserModelInterface {
  @Prop({
    required: true,
    type: SchemaTypes.Number,
    enum: [-1, 0, 1, 2, 3],
  })
  status: UserStatus;

  @Prop({
    required: true,
    type: PointGeoJSONSchema,
    index: '2dsphere',
  })
  location: PointGeoJSON;
}

export const RecipientUserSchema =
  SchemaFactory.createForClass<RecipientUserModelInterface>(Recipient);
