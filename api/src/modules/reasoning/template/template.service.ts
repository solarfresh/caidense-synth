import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '@/modules/base/base.service';
import { ReasoningTemplateDocument } from './template.schemas';


@Injectable()
export class ReasoningTemplateService extends BaseService<ReasoningTemplateDocument> {
  constructor(
    @InjectModel(ReasoningTemplateDocument.name) private reasoningTemplateModel: Model<ReasoningTemplateDocument>,
  ) {
    super(reasoningTemplateModel);
  }
}