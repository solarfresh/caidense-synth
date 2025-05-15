import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

@Injectable()
export class GoogleGenaiService {
  private readonly genAi: GoogleGenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = process.env.GENAI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('Gemini API key is not configured.');
    }

    this.genAi = new GoogleGenAI({vertexai: false, apiKey: apiKey});
    this.model = process.env.GENAI_MODEL
  }

  async generateContentFromMLDev(contents: string): Promise<GenerateContentResponse> {
    try {
      return await this.genAi.models.generateContent({
        model: this.model,
        contents: contents
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate text from Gemini.');
    }
  }

  async generateContentFromMLDevStream(contents: string): Promise<AsyncIterable<GenerateContentResponse>> {
    return await this.genAi.models.generateContentStream({
        model: this.model,
        contents: contents
    })
  } catch (error) {
    // Re-throw as a specific application error
    throw new InternalServerErrorException('Failed to initiate text streaming from the Generative AI model.');
  }
}