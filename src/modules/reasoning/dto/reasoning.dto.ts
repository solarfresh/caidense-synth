import { Types } from 'mongoose';
import { DocumentStatus } from '@/modules/base/base.interface';


export class ReasoningDto {
  _id: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}