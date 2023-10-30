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
          (this.volunteerReport === ResolveStatus.FULLFILLED &&
            this.recipientReport === ResolveStatus.FULLFILLED) ||
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
    findNotAccepted() {
      return this.find({ volunteer: { $eq: null } });
    },
    findAccepted() {
      return this.find({
        $and: [
          { volunteer: { $ne: null } },
          {
            $or: [
              {
                $and: [
                  { volunteerReport: ResolveStatus.PENDING },
                  { recipientReport: ResolveStatus.PENDING },
                ],
              },
              { isPendingChanges: true },
            ],
          },
        ],
      });
    },
    findCompleted() {
      return this.find({
        $and: [
          { volunteer: { $ne: null } },
          { isPendingChanges: false },
          {
            $or: [
              {
                $and: [
                  { volunteerReport: ResolveStatus.FULLFILLED },
                  { recipientReport: ResolveStatus.FULLFILLED },
                ],
              },
              {
                $and: [
                  { volunteerReport: ResolveStatus.REJECTED },
                  { recipientReport: ResolveStatus.REJECTED },
                ],
              },
              {
                $and: [
                  { adminResolve: { $ne: null } },
                  { adminResolve: { $ne: ResolveStatus.PENDING } },
                ],
              },
            ],
          },
        ],
      });
    },
    findConflicted() {
      return this.find({
        $and: [
          { volunteer: { $ne: null } },
          { isPendingChanges: false },
          { volunteerReport: { $ne: ResolveStatus.VIRGIN } },
          { recipientReport: { $ne: ResolveStatus.VIRGIN } },
          {
            $or: [
              {
                $and: [
                  { recipientReport: { $eq: ResolveStatus.PENDING } },
                  { volunteerReport: { $in: [ResolveStatus.REJECTED, ResolveStatus.FULLFILLED] } },
                ],
              },
              {
                $and: [
                  { recipientReport: { $eq: ResolveStatus.FULLFILLED } },
                  { volunteerReport: { $in: [ResolveStatus.REJECTED, ResolveStatus.PENDING] } },
                ],
              },
              {
                $and: [
                  { recipientReport: { $eq: ResolveStatus.REJECTED } },
                  { volunteerReport: { $in: [ResolveStatus.FULLFILLED, ResolveStatus.PENDING] } },
                ],
              },
              { adminResolve: ResolveStatus.PENDING },
            ],
          },
        ],
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
    enum: ['virgin', 'pending', 'fullfilled', 'rejected'],
  })
  adminResolve: ResolveStatus | null;

  category: ICategory & { _id: string | ObjectId };

  @Prop({ requred: true, type: mongoose.SchemaTypes.Date })
  date: Date | null;

  @Prop({ required: true, type: PointGeoJSONSchema })
  location: IPointGeoJSON;

  @Prop({ required: true, type: UserProfileSchema })
  recipient: UserProfileInterface;

  @Prop({
    default: 'virgin',
    type: mongoose.SchemaTypes.String,
    enum: ['virgin', 'pending', 'fullfilled', 'rejected'],
  })
  recipientReport: ResolveStatus;

  @Prop({ type: mongoose.SchemaTypes.String, required: true })
  title: string;

  @Prop({ default: null, type: UserProfileSchema })
  volunteer: UserProfileInterface;

  @Prop({
    default: 'virgin',
    type: mongoose.SchemaTypes.String,
    enum: ['virgin', 'pending', 'fullfilled', 'rejected'],
  })
  volunteerReport: ResolveStatus;

  @Prop({ type: mongoose.SchemaTypes.Boolean, required: true })
  isPendingChanges: boolean;
}

export const TaskSchema = SchemaFactory.createForClass<TaskInterface>(Task);
