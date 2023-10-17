import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Date } from 'mongoose';

@Schema()
export class Contact {
  @Prop({
    required: true,
    validate: {
      validator(v) {
        return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  })
  email: string;

  @Prop({ required: true })
  socialNetwork: string;

  @Prop()
  expiredAt: Date | null;

  @Prop({ required: true })
  createdAt: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
export type ContactDocument = HydratedDocument<Contact>;
