import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Root controller for the application.
 * This controller handles requests to the base path ("/")
 * and serves as a basic entry point or status check.
 */
@Controller() // The @Controller() decorator marks the class as a NestJS controller.
              // The path can be specified here, e.g., @Controller('app'),
              // but for the root controller, an empty path is common.
export class AppController {
  /**
   * Constructor for the AppController.
   * AppService is injected here using Dependency Injection.
   * @param appService The injected instance of AppService.
   */
  constructor(private readonly appService: AppService) {}
  // Example of another potential root endpoint, e.g., a health check:
  // /**
  //  * Handles HTTP GET requests to the "/health" path.
  //  * Provides a simple health status of the API.
  //  * @returns An object indicating the health status.
  //  */
  @Get('health') // Maps this method to GET requests at "/health"
  getHealth(): { status: string; timestamp: string } {
    // Assuming AppService has a getHealthStatus method
    return this.appService.getHealthStatus();
  }
}