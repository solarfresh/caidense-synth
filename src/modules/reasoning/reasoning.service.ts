import { BaseService } from '@/modules/base/base.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReasoningDocument } from './reasoning.schemas';

@Injectable()
export class ReasoningService extends BaseService<ReasoningDocument> {
  constructor(
    @InjectModel(ReasoningDocument.name) private visionModel: Model<ReasoningDocument>,
  ) {
    super(visionModel);
  }
}