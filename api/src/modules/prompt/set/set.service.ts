import { BaseService } from '@caidense/reasoning/common/common.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromptSetDocument } from './set.schemas';


@Injectable()
export class PromptSetService extends BaseService<PromptSetDocument> {
  constructor(
    @InjectModel(PromptSetDocument.name) private promptSetModel: Model<PromptSetDocument>,
  ) {
    super(promptSetModel);
  }
}