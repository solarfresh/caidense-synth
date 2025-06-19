import { BaseController } from '@/modules/base/base.controller';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'; // Import for Swagger documentation
import { CreateReasoningTemplateDto } from './dto/create-template.dto';
import { UpdateReasoningTemplateDto } from './dto/update-template.dto';
import { ReasoningTemplateDocument } from './template.schemas';
import { ReasoningTemplateService } from './template.service';


@ApiTags('Reasoning Template') // Tag for Swagger documentation
@Controller('reasoning/template') // Define the specific base path for this controller
// Apply the ClassSerializerInterceptor here as well, or rely on the one in BaseController
// If you want specific interceptors for this controller, apply them here.
// @UseInterceptors(ClassSerializerInterceptor)
// Apply guards if needed for this controller
// @UseGuards(AuthGuard('jwt'))
export class ReasoningTemplateController extends BaseController<ReasoningTemplateDocument, ReasoningTemplateService> {
  constructor(
      private readonly reasoningTemplateService: ReasoningTemplateService, // Inject the specific service
  ) {
    // Call the constructor of the BaseController, passing the injected specific service.
    super(reasoningTemplateService);
   }

  @Post()
  @ApiOperation({ summary: 'Create a new reasoning template' })
  @ApiBody({ type: CreateReasoningTemplateDto })
  @ApiResponse({
      status: 201,
      description: 'The reasoning template has been successfully created.',
      type: ReasoningTemplateDocument,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  async create(@Body(ValidationPipe) createReasoningTemplateDto: CreateReasoningTemplateDto): Promise<ReasoningTemplateDocument> {
    // Call the base controller's create method, passing the validated DTO.
    // The base method will delegate to the service.
    return super.create(createReasoningTemplateDto);
  }

  /**
   * Handles GET requests to retrieve all ReasoningTemplat documents.
   * Can add specific query handling if needed.
   * @returns A Promise resolving to an array of ReasoningTemplat documents.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all reasoning templates' })
  @ApiResponse({
      status: 200,
      description: 'Successfully retrieved all reasoning templates.',
      type: [ReasoningTemplateDocument],
  })
  @ApiResponse({ status: 404, description: 'Not Found - No templates found.' })
  async findAll(@Query() query?: any): Promise<ReasoningTemplateDocument[]> {
    const filter = query?.filter
    if (filter){
      const parsedFilter = JSON.parse(filter);
      return this.reasoningTemplateService.findAll(parsedFilter);
    }

    return this.reasoningTemplateService.findAll();
  }

  /**
   * Handles GET requests to retrieve a single ReasoningTemplat document by ID.
   * Overrides the base findById method.
   * @param id - The ID from the route parameter.
   * @returns A Promise resolving to the found ReasoningTemplat document.
   */

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a reasoning template by ID' })
  @ApiParam({ name: 'id', description: 'ID of the reasoning template to retrieve', type: String })
  @ApiResponse({
      status: 200,
      description: 'Successfully retrieved the reasoning template.',
      type: ReasoningTemplateDocument,
  })
  @ApiResponse({ status: 404, description: 'Not Found - Reasoning template with the given ID not found.' })
  async findById(@Param('id') id: string): Promise<ReasoningTemplateDocument> {
     // Call the base controller's findById method.
     return this.reasoningTemplateService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a reasoning template by ID' })
  @ApiParam({ name: 'id', description: 'ID of the reasoning template to update', type: String })
  @ApiBody({ type: UpdateReasoningTemplateDto })
  @ApiResponse({
      status: 200,
      description: 'Successfully updated the reasoning template.',
      type: ReasoningTemplateDocument,
  })
  @ApiResponse({ status: 404, description: 'Not Found - Reasoning template with the given ID not found.' })
  async update(@Param('id') id: string, @Body(ValidationPipe) updateReasoningTemplateDto: UpdateReasoningTemplateDto): Promise<ReasoningTemplateDocument> {
     // Call the base controller's update method, passing the ID and validated DTO.
     return super.update(id, updateReasoningTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reasoning template by ID' })
  @ApiParam({ name: 'id', description: 'ID of the reasoning template to delete', type: String })
  @ApiResponse({
      status: 200,
      description: 'Successfully deleted the reasoning template.',
  })
  @ApiResponse({ status: 404, description: 'Not Found - Reasoning template with the given ID not found.' })
  async deleteOne(@Param('id') id: string): Promise<void> {
    // Call the base controller's remove method.
    await super.deleteOne(id);
  }

  // Customized endpoints can be added here.
}
