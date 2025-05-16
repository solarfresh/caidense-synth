import { BaseController } from '@/modules/base/base.controller';
import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { PromptDocument } from '../prompt.schemas';
import { PromptService } from '../prompt.service';


@Controller('prompt') // Define the specific base path for this controller
// Apply the ClassSerializerInterceptor here as well, or rely on the one in BaseController
// If you want specific interceptors for this controller, apply them here.
// @UseInterceptors(ClassSerializerInterceptor)
// Apply guards if needed for this controller
// @UseGuards(AuthGuard('jwt'))
export class PromptController extends BaseController<PromptDocument, PromptService> {
  constructor(
      private readonly reasoningTemplateService: PromptService, // Inject the specific service
  ) {
    // Call the constructor of the BaseController, passing the injected specific service.
    super(reasoningTemplateService);
   }

  @Post()
  // Apply ValidationPipe with the specific DTO
  async create(@Body(ValidationPipe) createPromptDto: CreatePromptDto): Promise<PromptDocument> {
    // Call the base controller's create method, passing the validated DTO.
    // The base method will delegate to the service.
    return super.create(createPromptDto);
  }

  /**
   * Handles GET requests to retrieve all ReasoningTemplat documents.
   * Can add specific query handling if needed.
   * @returns A Promise resolving to an array of ReasoningTemplat documents.
   */
  @Get()
  async findAll(): Promise<PromptDocument[]> {
     // Call the base controller's findAll method.
     // If you need filtering via query params, you'd add @Query() here
     // and potentially pass it to super.findAll().
     return super.findAll();
  }

  /**
   * Handles GET requests to retrieve a single ReasoningTemplat document by ID.
   * Overrides the base findById method.
   * @param id - The ID from the route parameter.
   * @returns A Promise resolving to the found ReasoningTemplat document.
   */

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PromptDocument> {
     // Call the base controller's findById method.
     return super.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updatePromptDto: UpdatePromptDto): Promise<PromptDocument> {
     // Call the base controller's update method, passing the ID and validated DTO.
     return super.update(id, updatePromptDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    // Call the base controller's remove method.
    await super.deleteOne(id);
  }

  // Customized endpoints can be added here.
}
