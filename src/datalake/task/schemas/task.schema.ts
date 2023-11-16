import mongoose, { Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResolveStatus, TaskInterface, TaskStatus } from '../../../common/types/task.types';
import { ICategory } from '../../category/schemas/category.shema';
import { IPointGeoJSON, PointGeoJSONSchema } from '../../../common/schemas/geoJson.schema';
import { UserProfileInterface } from '../../../common/types/user.types';
import { UserProfileSchema } from '../../../common/schemas/user-profile.schema';

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
  statics: {
    findWithin(center: IPointGeoJSON, distance: number) {
      return this.find({
        location: {
          $near: {
            $geometry: center,
            $maxDistance: distance,
          },
        },
      });
    },
  },
})
export class Task extends Document implements TaskInterface {
  @Prop({ type: mongoose.SchemaTypes.String, required: true })
  address: string;

  @Prop({
    default: null,
    type: mongoose.SchemaTypes.String,
    enum: Object.values<string>(ResolveStatus),
  })
  adminResolve: ResolveStatus | null;

  category: ICategory & { _id: string | ObjectId };

  @Prop({ required: true, type: mongoose.SchemaTypes.Date })
  date: Date | null;

  @Prop({ required: true, type: PointGeoJSONSchema })
  location: IPointGeoJSON;

  @Prop({ required: true, type: UserProfileSchema })
  recipient: UserProfileInterface;

  @Prop({
    default: ResolveStatus.VIRGIN,
    type: mongoose.SchemaTypes.String,
    enum: Object.values<string>(ResolveStatus),
  })
  recipientReport: ResolveStatus;

  @Prop({ type: mongoose.SchemaTypes.String, required: true })
  title: string;

  @Prop({ default: null, type: UserProfileSchema })
  volunteer: UserProfileInterface;

  @Prop({
    default: ResolveStatus.VIRGIN,
    type: mongoose.SchemaTypes.String,
    enum: Object.values<string>(ResolveStatus),
  })
  volunteerReport: ResolveStatus;

  @Prop({ type: mongoose.SchemaTypes.Boolean, required: true })
  isPendingChanges: boolean;
}

export const TaskSchema = SchemaFactory.createForClass<TaskInterface>(Task);
