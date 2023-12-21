import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResolveStatus, TaskInterface, TaskStatus } from '../../../common/types/task.types';
import { PointGeoJSON, PointGeoJSONSchema } from '../../../common/schemas/PointGeoJSON.schema';
import { UserProfile, UserProfileSchema } from '../../../common/schemas/user-profile.schema';
import { POJOType } from '../../../common/types/pojo.type';
import { Category } from '../../category/schemas/category.schema';
import { GeoCoordinates } from '../../../common/types/point-geojson.types';

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
  },
  toObject: {
    versionKey: false,
    virtuals: true,
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

  category: POJOType<Category>;

  @Prop({ required: true, type: mongoose.SchemaTypes.Date })
  date: Date | null;

  @Prop({ required: true, type: PointGeoJSONSchema })
  location: POJOType<PointGeoJSON>;

  @Prop({ required: true, type: UserProfileSchema })
  recipient: POJOType<UserProfile>;

  @Prop({
    default: ResolveStatus.VIRGIN,
    type: mongoose.SchemaTypes.String,
    enum: Object.values<string>(ResolveStatus),
  })
  recipientReport: ResolveStatus;

  @Prop({ type: mongoose.SchemaTypes.String, required: true })
  title: string;

  @Prop({ default: null, type: UserProfileSchema })
  volunteer: POJOType<UserProfile>;

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
