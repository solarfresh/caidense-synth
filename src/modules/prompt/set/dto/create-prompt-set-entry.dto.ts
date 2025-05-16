import {
  IsNotEmpty, // Decorator to validate that a string, array, object, etc., is not empty
  IsOptional,
  IsString
} from 'class-validator';


export class CreatePromptSetEntryDto {
  @IsString()
  @IsNotEmpty({ message: 'role statement is required' })
  role: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'promptTemplateId statement is required' })
  promptTemplateId: string;

  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}