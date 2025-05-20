import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '@/modules/base/base.service';
import { ReasoningThinkingDocument } from './thinking.schemas';


@Injectable()
export class ReasoningThinkingService extends BaseService<ReasoningThinkingDocument> {
  constructor(
    @InjectModel(ReasoningThinkingDocument.name) private reasoningThinkingModel: Model<ReasoningThinkingDocument>,
  ) {
    super(reasoningThinkingModel);
  }
}