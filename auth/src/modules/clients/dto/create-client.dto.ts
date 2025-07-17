import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty, // Decorator to validate that a string, array, object, etc., is not empty
  IsOptional,
  IsString
} from 'class-validator';


export class CreateClientDto {
  @ApiProperty({
    description: 'The unique identifier for the client application.',
    example: 'my-client-id',
  })
  @IsString()
  @IsNotEmpty({ message: 'Client name is required' })
  name: string;

  @ApiProperty({
    description: 'The secret key for the client application.',
    example: 'my-client-secret',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'At least one allowed grant type is required' })
  @IsOptional()
  @IsEnum(['client_credentials', 'authorization_code', 'password'], { each: true, message: 'Invalid grant type' })
  allowedGrantTypes: string[];
}
