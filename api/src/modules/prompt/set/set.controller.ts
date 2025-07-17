import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import { BaseController } from '@/modules/base/base.controller';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreatePromptSetDto } from './dto/create-set.dto';
import { UpdatePromptSetDto } from './dto/update-set.dto';
import { PromptSetDocument } from './set.schemas';
import { PromptSetService } from './set.service';

// Import Swagger decorators
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Prompt Sets') // Tag the controller for Swagger UI
@Controller('prompt') // Define the specific base path for this controller
// Apply the ClassSerializerInterceptor here as well, or rely on the one in BaseController
// If you want specific interceptors for this controller, apply them here.
// @UseInterceptors(ClassSerializerInterceptor)
// Apply guards if needed for this controller
// @UseGuards(AuthGuard('jwt'))
export class PromptSetController extends BaseController<PromptSetDocument, PromptSetService> {
  constructor(
    private readonly promptSetService: PromptSetService, // Inject the specific service
  ) {
      // Call the constructor of the BaseController, passing the injected specific service.
    super(promptSetService);
  }

  @Post('set')
  @ApiOperation({ summary: 'Create a new prompt set' }) // Describe the operation
  @ApiResponse({ status: 201, description: 'The prompt set has been successfully created.' }) // Describe successful response
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' }) // Describe error response
  @ApiBody({ type: CreatePromptSetDto, description: 'Data for creating a new prompt set' }) // Optional: Explicitly describe the request body
  @UseGuards(JwtAuthGuard)
  async create(@Body(ValidationPipe) createPromptDto: CreatePromptSetDto): Promise<PromptSetDocument> {
    return super.create(createPromptDto);
  }

  @Get('set')
  @ApiOperation({ summary: 'Retrieve all prompt sets' }) // Describe the operation
  @ApiResponse({ status: 200, description: 'Successfully retrieved all prompt sets.' }) // Describe successful response
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<PromptSetDocument[]> {
    return super.findAll();
  }

  @Get('set/:id')
  @ApiOperation({ summary: 'Retrieve a prompt set by ID' }) // Describe the operation
  @ApiParam({ name: 'id', description: 'ID of the prompt set to retrieve', type: String }) // Describe the path parameter
  @ApiResponse({ status: 200, description: 'Successfully retrieved the prompt set.' }) // Describe successful response
  @ApiResponse({ status: 404, description: 'Not Found - Prompt set with the given ID not found.' }) // Describe error response
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<PromptSetDocument> {
    // Call the base controller's findById method.
    return super.findById(id);
  }

  @Put('set/:id')
  @ApiOperation({ summary: 'Update a prompt set by ID' }) // Describe the operation
  @ApiParam({ name: 'id', description: 'ID of the prompt set to update', type: String }) // Describe the path parameter
  @ApiResponse({ status: 200, description: 'The prompt set has been successfully updated.' }) // Describe successful response
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' }) // Describe error response
  @ApiResponse({ status: 404, description: 'Not Found - Prompt set with the given ID not found.' }) // Describe error response
  @ApiBody({ type: UpdatePromptSetDto, description: 'Data for updating the prompt set' }) // Optional: Explicitly describe the request body
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body(ValidationPipe) updatePromptDto: UpdatePromptSetDto): Promise<PromptSetDocument> {
    // Call the base controller's update method, passing the ID and validated DTO.
    return super.update(id, updatePromptDto);
  }

  @Delete('set/:id')
  @ApiOperation({ summary: 'Delete a prompt set by ID' }) // Describe the operation
  @ApiParam({ name: 'id', description: 'ID of the prompt set to delete', type: String }) // Describe the path parameter
  @ApiResponse({ status: 200, description: 'The prompt set has been successfully deleted.' }) // Describe successful response
  @ApiResponse({ status: 404, description: 'Not Found - Prompt set with the given ID not found.' }) // Describe error response
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param('id') id: string): Promise<void> {
    // Call the base controller's remove method.
    await super.deleteOne(id);
  }

  // Customized endpoints can be added here.
}