import mongoose, { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ResolveStatus,
  TaskInterface,
  TaskReport,
  TaskStatus,
} from '../../../common/types/task.types';
import { PointGeoJSON, PointGeoJSONSchema } from '../../../common/schemas/PointGeoJSON.schema';
import { UserProfile } from '../../../common/types/user.types';
import { rawUserProfile } from '../../../common/constants/mongoose-fields-raw-definition';
import { CategoryInterface } from '../../../common/types/category.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: false,
    flattenObjectIds: true,
  },
})
export class Task extends Document implements TaskInterface {
  @Prop({ type: mongoose.SchemaTypes.ObjectId, required: true })
  _id: string;

  @Prop({ type: mongoose.SchemaTypes.String, required: true })
  address: string;

  @Prop({
    default: TaskStatus.CREATED,
    type: mongoose.SchemaTypes.String,
    enum: Object.values(TaskStatus),
  })
  status: TaskStatus;

  @Prop({
    default: null,
    type: mongoose.SchemaTypes.String,
    enum: Object.values<string>(ResolveStatus),
  })
  adminResolve: ResolveStatus | null;

  category: CategoryInterface;

  @Prop({ required: true, type: mongoose.SchemaTypes.Date })
  date: Date | null;

  @Prop({ required: true, type: PointGeoJSONSchema })
  location: PointGeoJSON;

  @Prop({ type: raw(rawUserProfile), required: true, immutable: true })
  recipient: UserProfile;

  @Prop({
    default: null,
    type: mongoose.SchemaTypes.String,
    enum: Object.values<string>(TaskReport),
  })
  recipientReport: TaskReport | null;

  @Prop({ type: mongoose.SchemaTypes.String, required: true })
  title: string;

  @Prop({ type: raw(rawUserProfile), required: true, immutable: true })
  volunteer: UserProfile;

  @Prop({
    default: null,
    type: mongoose.SchemaTypes.String,
    enum: Object.values<string>(TaskReport),
  })
  volunteerReport: TaskReport | null;

  @Prop({ type: mongoose.SchemaTypes.Boolean, default: false })
  isPendingChanges: boolean;

  @Prop({ type: mongoose.SchemaTypes.String, required: true })
  description: string;

  /* static async findWithin(center: GeoCoordinates, distance: number): Promise<Array<Task>> {
    return Task.find({
      location: {
        $near: {
          $geometry: center,
          $maxDistance: distance,
        },
      },
    });
  } */
}
export const TaskSchema = SchemaFactory.createForClass<TaskInterface>(Task);
