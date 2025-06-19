import { BaseService } from '@caidense/reasoning/common/common.service';
import { ReasoningThinkingDocument } from '@caidense/reasoning/thinking/thinking.schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ReasoningTemplateDocument } from './template.schemas';


@Injectable()
export class ReasoningTemplateService extends BaseService<ReasoningTemplateDocument> {
  constructor(
    @InjectModel(ReasoningTemplateDocument.name) private reasoningTemplateModel: Model<ReasoningTemplateDocument>,
    @InjectModel(ReasoningThinkingDocument.name) private reasoningThinkingModel: Model<ReasoningThinkingDocument>,
  ) {
    super(reasoningTemplateModel);
  }

  async findAll(filter?: FilterQuery<ReasoningTemplateDocument>): Promise<ReasoningTemplateDocument[]> {
    const documents = await this.reasoningTemplateModel.find(filter).populate('activatedReasoningThinkingId').exec();
    return documents.map((document) => {return document.toJSON();});
  }

  async findById(id: string): Promise<ReasoningTemplateDocument> {
    const document = await this.reasoningTemplateModel.findById(id).populate('activatedReasoningThinkingId').exec();
    return document.toJSON();
  };
}