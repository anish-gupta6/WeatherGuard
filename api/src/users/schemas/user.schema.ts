import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVOKED = 'REVOKED',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  oauthId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  city: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: String, enum: Status, default: Status.PENDING })
  status: Status;

  @Prop()
  telegramChatId: string;

  @Prop()
  hashedRefreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
