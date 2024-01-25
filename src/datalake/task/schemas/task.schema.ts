import mongoose, { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResolveStatus, TaskInterface, TaskStatus } from '../../../common/types/task.types';
import { PointGeoJSON, PointGeoJSONSchema } from '../../../common/schemas/PointGeoJSON.schema';
import { Category } from '../../category/schemas/category.schema';
import { UserProfile } from '../../../common/types/user.types';
import { rawUserProfile } from '../../../common/constants/mongoose-fields-raw-definition';

@Schema({
  timestamps: true,
  virtuals: {
    status: {
      get() {
        if (!this.volunteer) {
          return TaskStatus.CREATED;
        }
        if (
          this.volunteerReport === ResolveStatus.PENDING &&
          this.recipientReport === ResolveStatus.PENDING
        ) {
          return TaskStatus.ACCEPTED;
        }
        if (
          (this.volunteerReport === ResolveStatus.FULFILLED &&
            this.recipientReport === ResolveStatus.FULFILLED) ||
          (this.volunteerReport === ResolveStatus.REJECTED &&
            this.recipientReport === ResolveStatus.REJECTED) ||
          (!!this.adminResolve && this.adminResolve !== ResolveStatus.PENDING)
        ) {
          return TaskStatus.COMPLETED;
        }
        return TaskStatus.CONFLICTED;
      },
    },
  },
  /* statics: {
    findWithin(center: GeoCoordinates, distance: number) {
      return this.find({
        location: {
          $near: {
            $geometry: center,
            $maxDistance: distance,
          },
        },
      });
    },
  }, */
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
    default: null,
    type: mongoose.SchemaTypes.String,
    enum: Object.values<string>(ResolveStatus),
  })
  adminResolve: ResolveStatus | null;

  category: Category;

  @Prop({ required: true, type: mongoose.SchemaTypes.Date })
  date: Date | null;

  @Prop({ required: true, type: PointGeoJSONSchema })
  location: PointGeoJSON;

  @Prop({ type: raw(rawUserProfile), required: true, immutable: true })
  recipient: UserProfile;

  @Prop({
    default: ResolveStatus.VIRGIN,
    type: mongoose.SchemaTypes.String,
    enum: Object.values<string>(ResolveStatus),
  })
  recipientReport: ResolveStatus;

  @Prop({ type: mongoose.SchemaTypes.String, required: true })
  title: string;

  @Prop({ type: raw(rawUserProfile), required: true, immutable: true })
  volunteer: UserProfile;

  @Prop({
    default: ResolveStatus.VIRGIN,
    type: mongoose.SchemaTypes.String,
    enum: Object.values<string>(ResolveStatus),
  })
  volunteerReport: ResolveStatus;

  @Prop({ type: mongoose.SchemaTypes.Boolean, required: true })
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
