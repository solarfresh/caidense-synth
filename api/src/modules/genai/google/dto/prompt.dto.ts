import { IsString } from 'class-validator';


export class PromptDto {
  @IsString()
  prompt: string;

  @IsString()
  modelName: string;
}
