import { BaseController } from '@/modules/base/base.controller';
import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { CreatePromptSetDto } from './dto/create-set.dto';
import { UpdatePromptSetDto } from './dto/update-set.dto';
import { PromptSetDocument } from './set.schemas';
import { PromptSetService } from './set.service';


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
  // Apply ValidationPipe with the specific DTO
  async create(@Body(ValidationPipe) createPromptDto: CreatePromptSetDto): Promise<PromptSetDocument> {
    // Call the base controller's create method, passing the validated DTO.
    // The base method will delegate to the service.
    return super.create(createPromptDto);
  }

  /**
   * Handles GET requests to retrieve all ReasoningTemplat documents.
   * Can add specific query handling if needed.
   * @returns A Promise resolving to an array of ReasoningTemplat documents.
   */
  @Get('set')
  async findAll(): Promise<PromptSetDocument[]> {
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

  @Get('set/:id')
  async findById(@Param('id') id: string): Promise<PromptSetDocument> {
     // Call the base controller's findById method.
     return super.findById(id);
  }

  @Put('set/:id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updatePromptDto: UpdatePromptSetDto): Promise<PromptSetDocument> {
     // Call the base controller's update method, passing the ID and validated DTO.
     return super.update(id, updatePromptDto);
  }

  @Delete('set/:id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    // Call the base controller's remove method.
    await super.deleteOne(id);
  }

  // Customized endpoints can be added here.
}
