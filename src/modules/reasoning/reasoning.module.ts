import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReasoningTemplateController } from './template/template.controller';
import { ReasoningTemplateService } from './template/template.service';
import { ReasoningTemplateSchema, ReasoningTemplateDocument } from './template/template.schemas';
import { ReasoningThinkingController } from './thinking/thinking.controller';
import { ReasoningThinkingService } from './thinking/thinking.service';
import { ReasoningThinkingSchema, ReasoningThinkingDocument } from './thinking/thinking.schemas';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReasoningTemplateDocument.name, schema: ReasoningTemplateSchema }]),
    MongooseModule.forFeature([{ name: ReasoningThinkingDocument.name, schema: ReasoningThinkingSchema }]),
  ],
  controllers: [ReasoningTemplateController, ReasoningThinkingController],
  providers: [ReasoningTemplateService, ReasoningThinkingService],
  exports: [ReasoningTemplateService, ReasoningThinkingService],
})
export class ReasoningModule {}