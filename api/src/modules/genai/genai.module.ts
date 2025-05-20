import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleGenaiService } from './google/google.service';
import { GoogleGenaiController } from './google/google.controller'


@Module({
  imports: [ConfigModule],
  controllers: [GoogleGenaiController],
  providers: [GoogleGenaiService],
  exports: [GoogleGenaiService],
})
export class GenaiModule {}