import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromptController } from './prompt/prompt.controller';
import { PromptService } from './prompt.service';
import { PromptSchema, PromptDocument } from './prompt/prompt.schemas';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: PromptDocument.name, schema: PromptSchema }]),
  ],
  controllers: [PromptController],
  providers: [PromptService],
  exports: [PromptService],
})
export class PromptModule {}