import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '@/modules/base/base.service';
import { PromptDocument } from './prompt/prompt.schemas';


@Injectable()
export class PromptService extends BaseService<PromptDocument> {
  constructor(
    @InjectModel(PromptDocument.name) private promptModel: Model<PromptDocument>,
  ) {
    super(promptModel);
  }
}