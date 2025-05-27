import { BaseService } from '@caidense/reasoning/common/common.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromptTextDocument } from './text.schemas';


@Injectable()
export class PromptTextService extends BaseService<PromptTextDocument> {
  constructor(
    @InjectModel(PromptTextDocument.name) private promptTextModel: Model<PromptTextDocument>,
  ) {
    super(promptTextModel);
  }
}
