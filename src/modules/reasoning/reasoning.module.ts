import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReasoningTemplateController } from './template/template.controller';
import { ReasoningTemplateService } from './template/template.service';
import { ReasoningTemplateSchema, ReasoningTemplateDocument } from './template/template.schemas';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReasoningTemplateDocument.name, schema: ReasoningTemplateSchema }]),
  ],
  controllers: [ReasoningTemplateController],
  providers: [ReasoningTemplateService],
  exports: [ReasoningTemplateService],
})
export class ReasoningModule {}