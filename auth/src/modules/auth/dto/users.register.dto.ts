import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import {
  IsNotEmpty,
  IsString
} from 'class-validator';


export class UserRegisterDto {
  @ApiProperty({
    description: 'The username for the new user.',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({
    description: 'The password for the new user.',
    example: 'securePassword123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  // Additional fields can be added as needed, e.g., email, roles, etc.
}