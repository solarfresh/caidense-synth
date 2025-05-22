import { GoogleGenaiService } from '@caidense/reasoning/executor/genai/google/google.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleGenaiController } from './google/google.controller';


@Module({
  imports: [ConfigModule],
  controllers: [GoogleGenaiController],
  providers: [GoogleGenaiService],
  exports: [GoogleGenaiService],
})
export class GenaiModule {}