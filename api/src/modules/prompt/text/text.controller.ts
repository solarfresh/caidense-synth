import { BaseController } from '@/modules/base/base.controller';
import { VariableDto } from '@caidense/reasoning/common/dto/common.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { CreatePromptTextDto } from './dto/create-text.dto'; // Assuming create-text.dto.ts exists
import { UpdatePromptTextDto } from './dto/update-text.dto'; // Assuming update-text.dto.ts exists
import { PromptTextDocument } from './text.schemas'; // Assuming text.schemas.ts exists
import { PromptTextService } from './text.service'; // Assuming text.service.ts exists
// Import Swagger decorators
import { UpdateVariableDto } from '@/modules/base/dto/update-variable.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVariableDto } from '@/modules/base/dto/create-variable.dto';


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

    @Post('text/:id/variables')
    @ApiOperation({ summary: 'Add a new variable to a prompt text document' })
    @ApiParam({ name: 'id', description: 'ID of the prompt text document to add the variable to', type: String })
    @ApiBody({ type: UpdateVariableDto, description: 'Data for the new variable to add' })
    @ApiResponse({ status: 200, description: 'The variable has been successfully added. Returns the updated prompt text document.', type: VariableDto })
    @ApiResponse({ status: 404, description: 'Not Found - Prompt text document with the given ID not found.' })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid variable data provided.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error - Failed to add the variable.' })
    async createVariable(@Param('id') id: string, @Body(ValidationPipe) createVariableDto: CreateVariableDto): Promise<VariableDto> {
        const variable = await this.promptTextService.createNestedDocument(id, 'variables', createVariableDto);
        return new VariableDto(variable);
    }

    @Get('text/:id/variables')
    @ApiOperation({ summary: 'Retrieve all variables from a prompt text document' })
    @ApiParam({ name: 'id', description: 'ID of the prompt text document to retrieve variables from', type: String })
    @ApiResponse({ status: 200, description: 'Successfully retrieved variables from the prompt text document.', type: [VariableDto] })
    @ApiResponse({ status: 404, description: 'Not Found - Prompt text document with the given ID not found.' })
    async findVariables(@Param('id') id: string): Promise<VariableDto[]> {
        const variables = await this.promptTextService.findNestedDocuments(id, 'variables');
        return variables.map((variable) => new VariableDto(variable));
    }

    @Get('text/:id/variables/:variableId')
    @ApiOperation({ summary: 'Retrieve a specific variable from a prompt text document' })
    @ApiParam({ name: 'id', description: 'ID of the prompt text document to retrieve the variable from', type: String })
    @ApiParam({ name: 'variableId', description: 'ID of the variable to retrieve', type: String })
    @ApiResponse({ status: 200, description: 'Successfully retrieved the variable from the prompt text document.', type: VariableDto })
    @ApiResponse({ status: 404, description: 'Not Found - Prompt text document or variable with the given ID not found.' })
    async findVariableById(@Param('id') id: string, @Param('variableId') variableId: string): Promise<VariableDto> {
        const variable = await this.promptTextService.findNestedDocumentById(id, 'variables', variableId);
        return new VariableDto(variable);
    }

    @Put('text/:id/variables/:variableId')
    @ApiOperation({ summary: 'Update a variable in a prompt text document' })
    @ApiParam({ name: 'id', description: 'ID of the prompt text document to update the variable in', type: String })
    @ApiParam({ name: 'variableId', description: 'ID of the variable to update', type: String })
    @ApiBody({ type: UpdateVariableDto, description: 'Data for updating the variable' })
    @ApiResponse({ status: 200, description: 'The variable has been successfully updated. Returns the updated prompt text document.', type: VariableDto })
    @ApiResponse({ status: 404, description: 'Not Found - Prompt text document or variable with the given ID not found.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error - Failed to update the variable.' })
    async updateVariableById(@Param('id') id: string, @Param('variableId') variableId: string, @Body(ValidationPipe) updateVariableDto: UpdateVariableDto): Promise<VariableDto> {
        const variable = await this.promptTextService.updateNestedDocumentById(id, 'variables', variableId, updateVariableDto);
        return new VariableDto(variable);
    }

    @Delete('text/:id/variables/:variableId')
    @ApiOperation({ summary: 'Delete a variable from a prompt text document' })
    @ApiParam({ name: 'id', description: 'ID of the prompt text document to delete the variable from', type: String })
    @ApiParam({ name: 'variableId', description: 'ID of the variable to delete', type: String })
    @ApiResponse({ status: 200, description: 'The variable has been successfully deleted. Returns the updated prompt text document.', type: VariableDto })
    @ApiResponse({ status: 404, description: 'Not Found - Prompt text document or variable with the given ID not found.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error - Failed to delete the variable.' })
    async deleteVariableById(@Param('id') id: string, @Param('variableId') variableId: string): Promise<void> {
        await this.promptTextService.deleteNestedDocumentById(id, 'variables', variableId);
    }

    // Customized endpoints can be added here.
}