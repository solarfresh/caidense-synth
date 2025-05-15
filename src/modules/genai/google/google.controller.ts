import {
  Body,
  Controller,
  Post
} from '@nestjs/common';
import { PromptDto } from './dto/prompt.dto';
import { GoogleGenaiService } from './google.service';


@Controller('genai')
export class GoogleGenaiController {
  constructor(private readonly GoogleGenaiService: GoogleGenaiService) {}

  @Post('google/dev/generate')
  async generateContentFromMLDev(@Body() promptDto: PromptDto): Promise<string> {
    const response = await this.GoogleGenaiService.generateContentFromMLDev(promptDto.prompt);
    return response.data
  }
}