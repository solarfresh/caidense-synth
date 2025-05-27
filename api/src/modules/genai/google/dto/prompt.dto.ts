import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class PromptDto {
  @ApiProperty({
    description: 'An input of LLM.',
    example: 'How is it, today?',
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    description: 'A model from a provder.',
    example: 'gemini-2.0-flash',
  })
  @IsString()
  modelName: string;
}
