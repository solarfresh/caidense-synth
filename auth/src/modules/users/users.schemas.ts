import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './users.interface';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class UserDocument extends Document implements User {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  password: string; // ⚠️ This property will store the HASHED password

  @Prop({ default: ['user'] }) // Default roles for a new user
  roles: string[];

  @Prop({ default: true }) // Indicates if the user account is active
  isActive: boolean;

  @Prop({ default: Date.now }) // Timestamp for creation
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

// Create the Mongoose Schema from the class
export const UserSchema = SchemaFactory.createForClass(UserDocument);