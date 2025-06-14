import { GoogleGenaiService } from '@caidense/reasoning/executor/genai/google/google.service';
import { GenerateContentResponse } from '@google/genai';
import {
  Body,
  Controller,
  Post
} from '@nestjs/common';
import { PromptDto } from './dto/prompt.dto';


@Controller('genai')
export class GoogleGenaiController {
  constructor(private readonly GoogleGenaiService: GoogleGenaiService) {}

  @Post('google/aistudio/generate')
  async generateContentFromAiStudio(@Body() promptDto: PromptDto): Promise<GenerateContentResponse> {
    return await this.GoogleGenaiService.generateContentFromAiStudio(promptDto.prompt, promptDto.modelName);
  }
}