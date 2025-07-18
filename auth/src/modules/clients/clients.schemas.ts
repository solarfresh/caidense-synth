import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Client } from './clients.interface';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ClientDocument extends Document implements Client {
  @Prop({ required: true, unique: true, index: true })
  clientId: string;

  @Prop({ required: true })
  clientSecret: string; // ⚠️ This will store the HASHED secret

  @Prop({ required: true })
  name: string;

  @Prop([String]) // Array of strings, e.g., ['client_credentials', 'authorization_code']
  allowedGrantTypes: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(ClientDocument);