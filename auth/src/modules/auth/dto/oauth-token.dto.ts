import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'; // npm install class-validator class-transformer


export class OAuthTokenDto {
  @ApiProperty({
    description: 'The type of grant being requested, e.g., "client_credentials", "password", "authorization_code".',
    example: 'client_credentials',
  })
  @IsNotEmpty()
  @IsString()
  grant_type: string; // e.g., 'client_credentials'

  @ApiProperty({
    description: 'The client ID of the application requesting the token.',
    example: 'my-client-id',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  client_id?: string;

  @ApiProperty({
    description: 'The client secret of the application requesting the token.',
    example: 'my-client-secret',
  })
  @IsOptional()
  @IsString()
  client_secret?: string;

  @IsOptional() // For other grant types
  @IsString()
  username?: string;

  @IsOptional() // For other grant types
  @IsString()
  password?: string;

  @IsOptional() // For other grant types
  @IsString()
  code?: string;

  @IsOptional() // For other grant types
  @IsString()
  redirect_uri?: string;
}