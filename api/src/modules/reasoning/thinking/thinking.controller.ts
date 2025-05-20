import { BaseController } from '@/modules/base/base.controller';
import { CreateVariableDto } from '@/modules/base/dto/create-variable.dto';
import { UpdateVariableDto } from '@/modules/base/dto/update-variable.dto';
import { VariableDto } from '@caidense/reasoning/common/dto/common.dto';
import { ExecutionEdgeDto } from '@caidense/reasoning/edge/dto/edge.dto';
import { ExecutionNodeDto } from '@caidense/reasoning/node/dto/node.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { CreateReasoningNodeDto } from '../node/dto/create-node.dto';
import { UpdateReasoningNodeDto } from '../node/dto/update-node.dto';
import { CreateReasoningThinkingDto, CreateReasoningThinkingEdgeDto } from './dto/create-thinking.dto';
import { UpdateReasoningThinkingDto, UpdateReasoningThinkingEdgeDto } from './dto/update-thinking.dto';
import { ReasoningThinkingDocument } from './thinking.schemas';
import { ReasoningThinkingService } from './thinking.service';


@ApiTags('Reasoning Thinking') // Define the tag for Swagger documentation
@Controller('reasoning/thinking') // Define the specific base path for this controller
// Apply the ClassSerializerInterceptor here as well, or rely on the one in BaseController
// If you want specific interceptors for this controller, apply them here.
// @UseInterceptors(ClassSerializerInterceptor)
// Apply guards if needed for this controller
// @UseGuards(AuthGuard('jwt'))
export class ReasoningThinkingController extends BaseController<ReasoningThinkingDocument, ReasoningThinkingService> {
  constructor(
      private readonly reasoningThinkingService: ReasoningThinkingService, // Inject the specific service
  ) {
    // Call the constructor of the BaseController, passing the injected specific service.
    super(reasoningThinkingService);
   }

  @Post()
  @ApiOperation({ summary: 'Create a new ReasoningThinking document' })
  @ApiBody({ type: CreateReasoningThinkingDto })
  @ApiResponse({
    status: 201,
    description: 'The ReasoningThinking document has been successfully created.',
    type: ReasoningThinkingDocument,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(@Body(ValidationPipe) createReasoningThinkingDto: CreateReasoningThinkingDto): Promise<ReasoningThinkingDocument> {
    // Call the base controller's create method, passing the validated DTO.
    // The base method will delegate to the service.
    return super.create(createReasoningThinkingDto);
  }

  /**
   * Handles GET requests to retrieve all ReasoningTemplat documents.
   * Can add specific query handling if needed.
   * @returns A Promise resolving to an array of ReasoningTemplat documents.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all ReasoningThinking documents' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all ReasoningThinking documents.',
    type: [ReasoningThinkingDocument],
  })
  async findAll(): Promise<ReasoningThinkingDocument[]> {
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
  @ApiOperation({ summary: 'Retrieve a ReasoningThinking document by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the ReasoningThinking document to retrieve',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the document.', type: ReasoningThinkingDocument })
  @ApiResponse({ status: 404, description: 'Not Found - ReasoningThinking document not found.' })
  async findById(@Param('id') id: string): Promise<ReasoningThinkingDocument> {
     // Call the base controller's findById method.
     return super.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a ReasoningThinking document by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the ReasoningThinking document to update',
    type: String,
  })
  @ApiBody({ type: UpdateReasoningThinkingDto })
  @ApiResponse({
    status: 200,
    description: 'The ReasoningThinking document has been successfully updated.',
    type: ReasoningThinkingDocument,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - ReasoningThinking document not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid update data.' })
  async update(@Param('id') id: string, @Body(ValidationPipe) updateReasoningThinkingDto: UpdateReasoningThinkingDto): Promise<ReasoningThinkingDocument> {
     // Call the base controller's update method, passing the ID and validated DTO.
     return super.update(id, updateReasoningThinkingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ReasoningThinking document by ID' })
  @ApiParam({ name: 'id', description: 'ID of the ReasoningThinking document to delete', type: String })
  @ApiResponse({ status: 200, description: 'The ReasoningThinking document has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found - ReasoningThinking document not found.' })
  async deleteOne(@Param('id') id: string): Promise<void> {
    // Call the base controller's remove method.
    await super.deleteOne(id);
  }

  @Post(':id/nodes')
  @ApiOperation({ summary: 'Add a new node to a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'The node has been successfully added.',
    type: ExecutionNodeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid node data.' })
  async createNode(
    @Param('id') id: string,
    @Body(ValidationPipe) createReasoningNodeDto: CreateReasoningNodeDto,
  ): Promise<ExecutionNodeDto> {
        const node = await this.reasoningThinkingService.createNestedDocument(id, 'nodes', createReasoningNodeDto);
        return new ExecutionNodeDto(node);
  }

  @Get(':id/nodes')
  @ApiOperation({ summary: 'Retrieve all nodes from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved nodes.',
    type: [ExecutionNodeDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document not found.',
  })
  async findNodes(@Param('id') id: string): Promise<ExecutionNodeDto[]> {
    const nodes = await this.reasoningThinkingService.findNestedDocuments(id, 'nodes');
    return nodes.map((node) => new ExecutionNodeDto(node));
  }

  @Get(':id/nodes/:nodeId')
  @ApiOperation({ summary: 'Retrieve a specific node from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'nodeId', description: 'ID of the node to retrieve', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the node.',
    type: ExecutionNodeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or node not found.',
  })
  async findNodeById(
    @Param('id') id: string,
    @Param('nodeId') nodeId: string,
  ): Promise<ExecutionNodeDto> {
    const node = await this.reasoningThinkingService.findNestedDocumentById(id, 'nodes', nodeId);
    return new ExecutionNodeDto(node);
  }

  @Put(':id/nodes/:nodeId')
  @ApiOperation({ summary: 'Update a specific node in a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'nodeId', description: 'ID of the node to update', type: String })
  @ApiBody({ type: UpdateReasoningNodeDto })
  @ApiResponse({
    status: 200,
    description: 'The node has been successfully updated.',
    type: ExecutionNodeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or node not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid update data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateNodeById(
    @Param('id') id: string,
    @Param('nodeId') nodeId: string,
    @Body() updateReasoningNodeDto: UpdateReasoningNodeDto,
  ): Promise<ExecutionNodeDto> {
    const node = await this.reasoningThinkingService.updateNestedDocumentById(id, 'nodes', nodeId, updateReasoningNodeDto);
    return new ExecutionNodeDto(node);
  }

  @Delete(':id/nodes/:nodeId')
  @ApiOperation({ summary: 'Delete a specific node from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'nodeId', description: 'ID of the node to delete', type: String })
  @ApiResponse({
    status: 200,
    description: 'The node has been successfully deleted.',
    type: Object, // 或定義一個 DeleteResult DTO
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or node not found.',
  })
  async deleteNodeById(
    @Param('id') id: string,
    @Param('nodeId') nodeId: string,
  ): Promise<void> {
    await this.reasoningThinkingService.deleteNestedDocumentById(id, 'nodes', nodeId);
  }

  @Post(':id/edges')
  @ApiOperation({ summary: 'Add a new edge to a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiBody({ type: CreateReasoningThinkingEdgeDto })
  @ApiResponse({
    status: 201,
    description: 'The edge has been successfully added.',
    type: ExecutionEdgeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid edge data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createEdge(
    @Param('id') id: string,
    @Body() createReasoningThinkingEdgeDto: CreateReasoningThinkingEdgeDto,
  ): Promise<ExecutionEdgeDto> {
    const newEdge = await this.reasoningThinkingService.createNestedDocument(
      id,
      'edges',
      createReasoningThinkingEdgeDto,
    );
    return new ExecutionEdgeDto(newEdge);
  }

  @Get(':id/edges')
  @ApiOperation({ summary: 'Retrieve all edges from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved edges.',
    type: [ExecutionEdgeDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document not found.',
  })
  async findEdges(@Param('id') id: string): Promise<ExecutionEdgeDto[]> {
    const edges = await this.reasoningThinkingService.findNestedDocuments(
      id,
      'edges',
    );
    return edges.map((edge) => new ExecutionEdgeDto(edge));
  }

  @Get(':id/edges/:edgeId')
  @ApiOperation({ summary: 'Retrieve a specific edge from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'edgeId', description: 'ID of the edge to retrieve', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the edge.',
    type: ExecutionEdgeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or edge not found.',
  })
  async findEdgeById(
    @Param('id') id: string,
    @Param('edgeId') edgeId: string,
  ): Promise<ExecutionEdgeDto> {
    const edge = await this.reasoningThinkingService.findNestedDocumentById(
      id,
      'edges',
      edgeId,
    );
    return new ExecutionEdgeDto(edge);
  }

  @Put(':id/edges/:edgeId')
  @ApiOperation({ summary: 'Update a specific edge in a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'edgeId', description: 'ID of the edge to update', type: String })
  @ApiBody({ type: UpdateReasoningThinkingEdgeDto })
  @ApiResponse({
    status: 200,
    description: 'The edge has been successfully updated.',
    type: ExecutionEdgeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or edge not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid update data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateEdgeById(
    @Param('id') id: string,
    @Param('edgeId') edgeId: string,
    @Body() updateReasoningThinkingEdgeDto: UpdateReasoningThinkingEdgeDto,
  ): Promise<ExecutionEdgeDto> {
    const updatedEdge = await this.reasoningThinkingService.updateNestedDocumentById(
      id,
      'edges',
      edgeId,
      updateReasoningThinkingEdgeDto,
    );
    return new ExecutionEdgeDto(updatedEdge);
  }

  @Delete(':id/edges/:edgeId')
  @ApiOperation({ summary: 'Delete a specific edge from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'edgeId', description: 'ID of the edge to delete', type: String })
  @ApiResponse({
    status: 200,
    description: 'The edge has been successfully deleted.',
    type: Object, // 或定義一個 DeleteResult DTO
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or edge not found.',
  })
  async deleteEdgeById(
    @Param('id') id: string,
    @Param('edgeId') edgeId: string,
  ): Promise<void> {
    await this.reasoningThinkingService.deleteNestedDocumentById(id, 'edges', edgeId);
  }

  @Post(':id/inputs')
  @ApiOperation({ summary: 'Add a new input variable to a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiBody({ type: CreateVariableDto })
  @ApiResponse({
    status: 201,
    description: 'The input variable has been successfully added.',
    type: VariableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid variable data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createInputVariable(
    @Param('id') id: string,
    @Body() createVariableDto: CreateVariableDto,
  ): Promise<VariableDto> {
    const newInput = await this.reasoningThinkingService.createNestedDocument(
      id,
      'inputs',
      createVariableDto,
    );
    return new VariableDto(newInput);
  }

  @Get(':id/inputs')
  @ApiOperation({ summary: 'Retrieve all input variables from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved input variables.',
    type: [VariableDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document not found.',
  })
  async findInputVariables(@Param('id') id: string): Promise<VariableDto[]> {
    const inputs = await this.reasoningThinkingService.findNestedDocuments(
      id,
      'inputs',
    );
    return inputs.map((input) => new VariableDto(input));
  }

  @Get(':id/inputs/:variableId')
  @ApiOperation({ summary: 'Retrieve a specific input variable from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'variableId', description: 'ID of the input variable to retrieve', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the input variable.',
    type: VariableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or input variable not found.',
  })
  async findInputVariableById(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
  ): Promise<VariableDto> {
    const input = await this.reasoningThinkingService.findNestedDocumentById(
      id,
      'inputs',
      variableId,
    );
    return new VariableDto(input);
  }

  @Put(':id/inputs/:variableId')
  @ApiOperation({ summary: 'Update a specific input variable in a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'variableId', description: 'ID of the input variable to update', type: String })
  @ApiBody({ type: UpdateVariableDto })
  @ApiResponse({
    status: 200,
    description: 'The input variable has been successfully updated.',
    type: VariableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or input variable not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid update data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateInputVariableById(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
    @Body() updateVariableDto: UpdateVariableDto,
  ): Promise<VariableDto> {
    const updatedInput = await this.reasoningThinkingService.updateNestedDocumentById(
      id,
      'inputs',
      variableId,
      updateVariableDto,
    );
    return new VariableDto(updatedInput);
  }

  @Delete(':id/inputs/:variableId')
  @ApiOperation({ summary: 'Delete a specific input variable from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'variableId', description: 'ID of the input variable to delete', type: String })
  @ApiResponse({
    status: 200,
    description: 'The input variable has been successfully deleted.',
    type: Object, // 或定義一個 DeleteResult DTO
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or input variable not found.',
  })
  async deleteInputVariableById(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
  ): Promise<void> {
    await this.reasoningThinkingService.deleteNestedDocumentById(id, 'inputs', variableId);
  }

  @Post(':id/outputs')
  @ApiOperation({ summary: 'Add a new output variable to a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiBody({ type: CreateVariableDto })
  @ApiResponse({
    status: 201,
    description: 'The output variable has been successfully added.',
    type: VariableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid variable data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createOutputVariable(
    @Param('id') id: string,
    @Body() createVariableDto: CreateVariableDto,
  ): Promise<VariableDto> {
    const newOutput = await this.reasoningThinkingService.createNestedDocument(
      id,
      'outputs',
      createVariableDto,
    );
    return new VariableDto(newOutput);
  }

  @Get(':id/outputs')
  @ApiOperation({ summary: 'Retrieve all output variables from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved output variables.',
    type: [VariableDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document not found.',
  })
  async findOutputVariables(@Param('id') id: string): Promise<VariableDto[]> {
    const outputs = await this.reasoningThinkingService.findNestedDocuments(
      id,
      'outputs',
    );
    return outputs.map((output) => new VariableDto(output));
  }

  @Get(':id/outputs/:variableId')
  @ApiOperation({ summary: 'Retrieve a specific output variable from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'variableId', description: 'ID of the output variable to retrieve', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the output variable.',
    type: VariableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or output variable not found.',
  })
  async findOutputVariableById(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
  ): Promise<VariableDto> {
    const output = await this.reasoningThinkingService.findNestedDocumentById(
      id,
      'outputs',
      variableId,
    );
    return new VariableDto(output);
  }

  @Put(':id/outputs/:variableId')
  @ApiOperation({ summary: 'Update a specific output variable in a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'variableId', description: 'ID of the output variable to update', type: String })
  @ApiBody({ type: UpdateVariableDto })
  @ApiResponse({
    status: 200,
    description: 'The output variable has been successfully updated.',
    type: VariableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or output variable not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid update data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateOutputVariableById(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
    @Body() updateVariableDto: UpdateVariableDto,
  ): Promise<VariableDto> {
    const updatedOutput = await this.reasoningThinkingService.updateNestedDocumentById(
      id,
      'outputs',
      variableId,
      updateVariableDto,
    );
    return new VariableDto(updatedOutput);
  }

  @Delete(':id/outputs/:variableId')
  @ApiOperation({ summary: 'Delete a specific output variable from a thinking flow' })
  @ApiParam({
    name: 'id',
    description: 'ID of the thinking flow document',
    type: String,
  })
  @ApiParam({ name: 'variableId', description: 'ID of the output variable to delete', type: String })
  @ApiResponse({
    status: 200,
    description: 'The output variable has been successfully deleted.',
    type: Object, // 或定義一個 DeleteResult DTO
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Thinking flow document or output variable not found.',
  })
  async deleteOutputVariableById(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
  ): Promise<void> {
    await this.reasoningThinkingService.deleteNestedDocumentById(id, 'outputs', variableId);
  }

  // Customized endpoints can be added here.
}
