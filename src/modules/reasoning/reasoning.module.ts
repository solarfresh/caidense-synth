import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReasoningTemplateController } from './template/template.controller';
import { ReasoningTemplateService } from './template/template.service';
import { ReasoningTemplateSchema, ReasoningTemplateDocument } from './template/template.schemas';
import { ReasoningThinkingController } from './thinking/thinking.controller';
import { ReasoningThinkingService } from './thinking/thinking.service';
import { ReasoningThinkingSchema, ReasoningThinkingDocument } from './thinking/thinking.schemas';
import { ReasoningNodeController } from './node/node.controller';
import { ReasoningNodeService } from './node/node.service';
import { ReasoningNodeSchema, ReasoningNodeDocument } from './node/node.schemas';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReasoningTemplateDocument.name, schema: ReasoningTemplateSchema }]),
    MongooseModule.forFeature([{ name: ReasoningThinkingDocument.name, schema: ReasoningThinkingSchema }]),
    MongooseModule.forFeature([{ name: ReasoningNodeDocument.name, schema: ReasoningNodeSchema }]),
  ],
  controllers: [ReasoningTemplateController, ReasoningThinkingController, ReasoningNodeController],
  providers: [ReasoningTemplateService, ReasoningThinkingService, ReasoningNodeService],
  exports: [ReasoningTemplateService, ReasoningThinkingService, ReasoningNodeService],
})
export class ReasoningModule {}