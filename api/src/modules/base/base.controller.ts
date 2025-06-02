import { BaseService } from '@caidense/reasoning/common/common.service';
import {
  Body,
  ClassSerializerInterceptor,
  Delete,
  Get,
  HttpCode, // For custom status codes like 204 No Content on delete
  HttpStatus // For HttpStatus enums
  ,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors
} from '@nestjs/common';
import { Document } from 'mongoose'; // Assuming Mongoose is used

/**
 * Generic Base Controller providing common RESTful API routes for CRUD operations.
 * This controller is designed to be extended by specific feature controllers.
 * It assumes the extending controller will define the base route path (@Controller('path')).
 *
 * @template T - The Mongoose Document type (e.g., VisionDocument) that the service returns.
 * @template S - The specific service type that provides CRUD operations for type T.
 * Must implement the BaseService<T> interface implicitly or explicitly.
 */
// Apply ClassSerializerInterceptor globally to the base controller
// This is useful if your DTOs use @Expose()/@Exclude() or have constructors
// to shape the outgoing response data.
@UseInterceptors(ClassSerializerInterceptor)
export class BaseController<T extends Document, S extends BaseService<T>> {
  // The specific service instance is injected by the extending class's constructor
  // and passed to the super() constructor.
  // 'protected' allows extending classes to access the service instance if needed for custom logic.
  protected readonly service: S;

  /**
   * Constructor for the BaseController.
   * The specific service instance is passed by the extending class.
   * @param service - The service instance providing CRUD operations.
   */
  constructor(service: S) {
    this.service = service;
  }

  /**
   * Handles POST requests to create a new resource.
   * The specific validation (e.g., using ValidationPipe with a specific DTO)
   * should be applied in the extending controller method.
   * @param createDto - The request body containing data for creation.
   * @returns A Promise resolving to the created resource.
   */
  @Post()
  async create(@Body() createDto: any): Promise<T> {
    // Delegate the creation logic to the service
    return this.service.create(createDto);
  }

  /**
   * Handles GET requests to retrieve all resources.
   * Optional query parameters can be handled by the service based on the filter object.
   * @param filter - Optional filter object from query parameters.
   * @returns A Promise resolving to an array of resources.
   */
  @Get()
  async findAll(@Query() filter?: any): Promise<T[]> {
     // Delegate the find all logic to the service
     // Pass the filter, the service will decide how to apply it
    return this.service.findAll(filter);
  }

  /**
   * Handles GET requests to retrieve a single resource by ID.
   * @param id - The ID of the resource from the route parameter.
   * @returns A Promise resolving to the found resource.
   * @throws NotFoundException if the resource is not found.
   */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<T> {
    // Delegate the find by ID logic to the service
    // Service is expected to throw NotFoundException if not found
    return this.service.findById(id);
  }

  /**
   * Handles PUT requests to update a resource by ID.
   * The specific validation (e.g., using ValidationPipe with a specific DTO)
   * should be applied in the extending controller method.
   * @param id - The ID of the resource from the route parameter.
   * @param updateDto - The request body containing data for update.
   * @returns A Promise resolving to the updated resource.
   * @throws NotFoundException if the resource is not found.
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any): Promise<T> {
    // Delegate the update logic to the service
    // Service is expected to throw NotFoundException if not found
    return this.service.update(id, updateDto);
  }

  /**
   * Handles DELETE requests to remove a resource by ID.
   * Returns 204 No Content on successful deletion.
   * @param id - The ID of the resource from the route parameter.
   * @throws NotFoundException if the resource is not found.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on success
  async deleteOne(@Param('id') id: string): Promise<void> { // Return type void for 204
     // Delegate the remove logic to the service
     // Service is expected to throw NotFoundException if not found
     await this.service.deleteOne(id);
  }

  // You can add more generic methods here if you have common patterns,
  // e.g., pagination endpoints like @Get() with @Query() for limit/offset,
  // soft delete methods, etc.
}