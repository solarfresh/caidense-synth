import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import { GoogleGenaiService } from '@caidense/reasoning/executor/genai/google/google.service';
import { GenerateContentResponse } from '@google/genai';
import {
  Body,
  Controller,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PromptDto } from './dto/prompt.dto';


@ApiBearerAuth()
@Controller('genai')
export class GoogleGenaiController {
  constructor(private readonly GoogleGenaiService: GoogleGenaiService) {}

  @Post('google/aistudio/generate')
  @ApiOperation({ summary: 'Generate content using Google AI Studio' })
  @ApiResponse({ status: 200, description: 'Content generated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiBody({ type: PromptDto, description: 'Data for generating content using Google AI Studio' })
  @UseGuards(JwtAuthGuard)
  async generateContentFromAiStudio(@Body() promptDto: PromptDto): Promise<GenerateContentResponse> {
    return await this.GoogleGenaiService.generateContentFromAiStudio(promptDto.prompt, promptDto.modelName);
  }
}