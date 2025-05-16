import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromptTextController } from './text/text.controller';
import { PromptTextService } from './text/text.service';
import { PromptTextSchema, PromptTextDocument } from './text/text.schemas';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: PromptTextDocument.name, schema: PromptTextSchema }]),
  ],
  controllers: [PromptTextController],
  providers: [PromptTextService],
  exports: [PromptTextService],
})
export class PromptModule {}