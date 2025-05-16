import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromptTextController } from './text/text.controller';
import { PromptTextService } from './text/text.service';
import { PromptTextSchema, PromptTextDocument } from './text/text.schemas';
import { PromptSetController } from './set/set.controller';
import { PromptSetService } from './set/set.service';
import { PromptSetSchema, PromptSetDocument } from './set/set.schemas';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: PromptTextDocument.name, schema: PromptTextSchema }]),
    MongooseModule.forFeature([{ name: PromptSetDocument.name, schema: PromptSetSchema }]),
  ],
  controllers: [PromptTextController, PromptSetController],
  providers: [PromptTextService, PromptSetService],
  exports: [PromptTextService, PromptSetService],
})
export class PromptModule {}