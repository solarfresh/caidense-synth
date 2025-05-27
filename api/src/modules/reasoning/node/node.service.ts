import { BaseService } from '@caidense/reasoning/common/common.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReasoningNodeDocument } from './node.schemas';


@Injectable()
export class ReasoningNodeService extends BaseService<ReasoningNodeDocument> {
  constructor(
    @InjectModel(ReasoningNodeDocument.name) private reasoningNodeModel: Model<ReasoningNodeDocument>,
  ) {
    super(reasoningNodeModel);
  }
}