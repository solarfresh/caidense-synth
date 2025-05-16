import {
  IsOptional,
  IsString
} from 'class-validator';

export class CreateReasoningThinkingEdgeDto {

  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  sourceHandle?: string;

  @IsString()
  target: string;

  @IsOptional()
  @IsString()
  targetHandle?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  label?: string;

  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}