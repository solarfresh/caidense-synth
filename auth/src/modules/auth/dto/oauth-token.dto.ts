import { IsString, IsNotEmpty, IsOptional } from 'class-validator'; // npm install class-validator class-transformer


export class OAuthTokenDto {
  @IsNotEmpty()
  @IsString()
  grant_type: string; // e.g., 'client_credentials'

  @IsOptional()
  @IsString()
  client_id?: string;

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