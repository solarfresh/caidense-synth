import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString
} from 'class-validator';


export class UpdateExecutionEdgeDto {
  @ApiProperty({
    description: 'The ID of the source node',
    example: 'source-node-id',
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({
    description: 'The specific handle/port ID on the source node where the edge starts.',
    example: 'true',
  })
  @IsOptional()
  @IsString()
  sourceHandle?: string;

  @ApiProperty({
    description: 'The ID of the target node',
    example: 'target-node-id',
  })
  @IsOptional()
  @IsString()
  target?: string;

  @ApiProperty({
    description: 'The specific handle/port ID on the target node where the edge ends.',
    example: 'false',
  })
  @IsOptional()
  @IsString()
  targetHandle?: string;

  @ApiProperty({
    description: 'The type of the edge, which is optional.',
    example: 'default',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'The label of the edge, which is optional.',
    example: 'Edge Label',
  })
  @IsOptional()
  @IsString()
  label?: string;

  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}
