import { BaseController } from '@/modules/base/base.controller';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateReasoningNodeDto } from './dto/create-node.dto';
import { ReasoningNodeDto } from './dto/node.dto';
import { UpdateReasoningNodeDto } from './dto/update-node.dto';
import { ReasoningNodeDocument } from './node.schemas';
import { ReasoningNodeService } from './node.service';


@ApiTags('Reasoning Nodes')
@Controller('reasoning/nodes')
export class ReasoningNodeController extends BaseController<ReasoningNodeDocument, ReasoningNodeService> {
  constructor(private readonly reasoningNodeService: ReasoningNodeService) {
    super(reasoningNodeService);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new reasoning node' })
  @ApiBody({ type: CreateReasoningNodeDto })
  @ApiResponse({
    status: 201,
    description: 'The reasoning node has been successfully created.',
    type: ReasoningNodeDocument,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  async create(
    @Body(ValidationPipe) createReasoningNodeDto: CreateReasoningNodeDto,
  ): Promise<ReasoningNodeDocument> {
    return super.create(createReasoningNodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all reasoning nodes' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all reasoning nodes.',
    type: [ReasoningNodeDto],
  })
  async findAll(): Promise<ReasoningNodeDocument[]> {
    return super.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a reasoning node by ID' })
  @ApiParam({ name: 'id', description: 'ID of the reasoning node to retrieve', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the reasoning node.',
    type: ReasoningNodeDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found - Reasoning node with the given ID not found.' })
  async findOne(@Param('id') id: string): Promise<ReasoningNodeDocument> {
    return super.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a reasoning node by ID' })
  @ApiParam({ name: 'id', description: 'ID of the reasoning node to update', type: String })
  @ApiBody({ type: UpdateReasoningNodeDto })
  @ApiResponse({
    status: 200,
    description: 'The reasoning node has been successfully updated.',
    type: ReasoningNodeDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found - Reasoning node with the given ID not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid update data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateReasoningNodeDto: UpdateReasoningNodeDto,
  ): Promise<ReasoningNodeDocument> {
    return super.update(id, updateReasoningNodeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reasoning node by ID' })
  @ApiParam({ name: 'id', description: 'ID of the reasoning node to delete', type: String })
  @ApiResponse({
    status: 200,
    description: 'The reasoning node has been successfully deleted.',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'Not Found - Reasoning node with the given ID not found.' })
  async delete(@Param('id') id: string): Promise<void> {
    await super.deleteOne(id);
  }

  // Customized endpoints can be added here.
}