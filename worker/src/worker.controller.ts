import { Controller, Get } from '@nestjs/common';
import { WorkerService } from './worker.service';

/**
 * Root controller for the application.
 * This controller handles requests to the base path ("/")
 * and serves as a basic entry point or status check.
 */
@Controller() // The @Controller() decorator marks the class as a NestJS controller.
              // The path can be specified here, e.g., @Controller('app'),
              // but for the root controller, an empty path is common.
export class WorkerController {
  /**
   * Constructor for the WorkerController.
   * WorkerService is injected here using Dependency Injection.
   * @param workerService The injected instance of WorkerService.
   */
  constructor(private readonly workerService: WorkerService) {}
  // Example of another potential root endpoint, e.g., a health check:
  // /**
  //  * Handles HTTP GET requests to the "/health" path.
  //  * Provides a simple health status of the API.
  //  * @returns An object indicating the health status.
  //  */
  @Get('health') // Maps this method to GET requests at "/health"
  getHealth(): { status: string; timestamp: string } {
    // Assuming WorkerService has a getHealthStatus method
    return this.workerService.getHealthStatus();
  }
}