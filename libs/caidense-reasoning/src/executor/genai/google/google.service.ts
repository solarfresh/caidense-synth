import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';


@Injectable()
export class GoogleGenaiService {
  private readonly genAi: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get('GENAI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('Gemini API key is not configured.');
    }

    this.genAi = new GoogleGenAI({vertexai: false, apiKey: apiKey});
  }

  async generateContentFromAiStudio(contents: string, modelName: string): Promise<GenerateContentResponse> {
    try {
      return await this.genAi.models.generateContent({
        model: modelName,
        contents: contents
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate text from Gemini.');
    }
  }

  async generateContentFromAiStudioStream(contents: string, modelName: string): Promise<AsyncIterable<GenerateContentResponse>> {
    return await this.genAi.models.generateContentStream({
        model: modelName,
        contents: contents
    })
  } catch (error) {
    // Re-throw as a specific application error
    throw new InternalServerErrorException('Failed to initiate text streaming from the Generative AI model.');
  }
}