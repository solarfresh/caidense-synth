import { CreateReasoningThinkingDto } from '@/modules/reasoning/thinking/dto/create-thinking.dto';
import { UpdateReasoningThinkingDto } from '../thinking/dto/update-thinking.dto';
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

  async createThinking(id: string, createThinking: CreateReasoningThinkingDto): Promise<ReasoningTemplateDocument> {
    const thinkingDocument = new this.reasoningThinkingModel(createThinking);
    const templateDocument = await this.reasoningTemplateModel.findByIdAndUpdate(id, {activatedReasoningThinkingId: thinkingDocument.id}, { new: true }).populate('activatedReasoningThinkingId').exec();

    thinkingDocument.save();
    return templateDocument.toJSON();
  }

  async updateThinking(id: string, updateThinking: UpdateReasoningThinkingDto): Promise<ReasoningTemplateDocument> {
    const templateDocument = await this.reasoningTemplateModel.findById(id).populate('activatedReasoningThinkingId').exec();
    const thinkingDocument = await this.reasoningThinkingModel.findByIdAndUpdate(templateDocument.activatedReasoningThinkingId._id, updateThinking as any, { new: true }).exec();
    templateDocument.activatedReasoningThinkingId = thinkingDocument.toJSON() as any;
    return templateDocument.toJSON();
  };

  async findAll(filter?: FilterQuery<ReasoningTemplateDocument>): Promise<ReasoningTemplateDocument[]> {
    const documents = await this.reasoningTemplateModel.find(filter).populate('activatedReasoningThinkingId').exec();
    return documents.map((document) => {return document.toJSON();});
  }

  async findById(id: string): Promise<ReasoningTemplateDocument> {
    const document = await this.reasoningTemplateModel.findById(id).populate('activatedReasoningThinkingId').exec();
    return document.toJSON();
  };
}