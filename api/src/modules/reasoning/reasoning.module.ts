import { ReasoningThinkingDocument, ReasoningThinkingSchema } from '@caidense/reasoning/thinking/thinking.schemas';
import { ReasoningThinkingService } from '@caidense/reasoning/thinking/thinking.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReasoningNodeController } from './node/node.controller';
import { ReasoningNodeDocument, ReasoningNodeSchema } from './node/node.schemas';
import { ReasoningNodeService } from './node/node.service';
import { ReasoningTemplateController } from './template/template.controller';
import { ReasoningTemplateDocument, ReasoningTemplateSchema } from './template/template.schemas';
import { ReasoningTemplateService } from './template/template.service';
import { ReasoningThinkingController } from './thinking/thinking.controller';


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