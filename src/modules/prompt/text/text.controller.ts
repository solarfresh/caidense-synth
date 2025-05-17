import { BaseController } from '@/modules/base/base.controller';
import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { CreatePromptTextDto } from './dto/create-text.dto'; // Assuming create-text.dto.ts exists
import { UpdatePromptTextDto } from './dto/update-text.dto'; // Assuming update-text.dto.ts exists
import { PromptTextDocument } from './text.schemas'; // Assuming text.schemas.ts exists
import { PromptTextService } from './text.service'; // Assuming text.service.ts exists

// Import Swagger decorators
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';


@ApiTags('Prompt Texts') // Tag the controller for Swagger UI
@Controller('prompt') // Define the specific base path for this controller
// Apply the ClassSerializerInterceptor here as well, or rely on the one in BaseController
// If you want specific interceptors for this controller, apply them here.
// @UseInterceptors(ClassSerializerInterceptor)
// Apply guards if needed for this controller
// @UseGuards(AuthGuard('jwt'))
export class PromptTextController extends BaseController<PromptTextDocument, PromptTextService> {
    constructor(
        private readonly promptTextService: PromptTextService, // Inject the specific service
    ) {
        // Call the constructor of the BaseController, passing the injected specific service.
        super(promptTextService);
    }

    @Post('text')
    @ApiOperation({ summary: 'Create a new prompt text document' }) // Describe the operation
    @ApiResponse({ status: 201, description: 'The prompt text document has been successfully created.' }) // Describe successful response
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' }) // Describe error response
    @ApiBody({ type: CreatePromptTextDto, description: 'Data for creating a new prompt text document' }) // Explicitly describe the request body
    async create(@Body(ValidationPipe) createPromptDto: CreatePromptTextDto): Promise<PromptTextDocument> {
        // Call the base controller's create method, passing the validated DTO.
        // The base method will delegate to the service.
        return super.create(createPromptDto);
    }

    /**
     * Handles GET requests to retrieve all Prompt Text documents.
     * Can add specific query handling if needed.
     * @returns A Promise resolving to an array of PromptText documents.
     */
    @Get('text')
    @ApiOperation({ summary: 'Retrieve all prompt text documents' }) // Describe the operation
    @ApiResponse({ status: 200, description: 'Successfully retrieved all prompt text documents.' }) // Describe successful response
    async findAll(): Promise<PromptTextDocument[]> {
        // Call the base controller's findAll method.
        // If you need filtering via query params, you'd add @Query() here
        // and potentially pass it to super.findAll().
        return super.findAll();
    }

    /**
     * Handles GET requests to retrieve a single Prompt Text document by ID.
     * Overrides the base findById method.
     * @param id - The ID from the route parameter.
     * @returns A Promise resolving to the found PromptText document.
     */
    @Get('text/:id')
    @ApiOperation({ summary: 'Retrieve a prompt text document by ID' }) // Describe the operation
    @ApiParam({ name: 'id', description: 'ID of the prompt text document to retrieve', type: String }) // Describe the path parameter
    @ApiResponse({ status: 200, description: 'Successfully retrieved the prompt text document.' }) // Describe successful response
    @ApiResponse({ status: 404, description: 'Not Found - Prompt text document with the given ID not found.' }) // Describe error response
    async findById(@Param('id') id: string): Promise<PromptTextDocument> {
        // Call the base controller's findById method.
        return super.findById(id);
    }

    @Put('text/:id')
    @ApiOperation({ summary: 'Update a prompt text document by ID' }) // Describe the operation
    @ApiParam({ name: 'id', description: 'ID of the prompt text document to update', type: String }) // Describe the path parameter
    @ApiResponse({ status: 200, description: 'The prompt text document has been successfully updated.' }) // Describe successful response
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' }) // Describe error response
    @ApiResponse({ status: 404, description: 'Not Found - Prompt text document with the given ID not found.' }) // Describe error response
    @ApiBody({ type: UpdatePromptTextDto, description: 'Data for updating the prompt text document' }) // Explicitly describe the request body
    async update(@Param('id') id: string, @Body(ValidationPipe) updatePromptDto: UpdatePromptTextDto): Promise<PromptTextDocument> {
        // Call the base controller's update method, passing the ID and validated DTO.
        return super.update(id, updatePromptDto);
    }

    @Delete('text/:id')
    @ApiOperation({ summary: 'Delete a prompt text document by ID' }) // Describe the operation
    @ApiParam({ name: 'id', description: 'ID of the prompt text document to delete', type: String }) // Describe the path parameter
    @ApiResponse({ status: 200, description: 'The prompt text document has been successfully deleted.' }) // Describe successful response
    @ApiResponse({ status: 404, description: 'Not Found - Prompt text document with the given ID not found.' }) // Describe error response
    async deleteOne(@Param('id') id: string): Promise<void> {
        // Call the base controller's remove method.
        await super.deleteOne(id);
    }

    // Customized endpoints can be added here.
}