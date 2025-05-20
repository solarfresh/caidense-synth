import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExecutionModule } from './execution/execution.module';
import { WorkerController } from './worker.controller'; // Controller to handle HTTP requests if needed
import { WorkerService } from './worker.service'; // Service to handle incoming messages and orchestrate execution


@Module({
  imports: [
    // Configure ConfigModule to load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make configuration available globally within this worker
      // envFilePath: ['./.env', './docker-var.env'], // Specify env files if needed
    }),
    ExecutionModule
    // ... import other modules required by executors (e.g., HttpModule, MongooseModule if needed, but generally keep workers stateless)
  ],
  controllers: [WorkerController],
  providers: [
    WorkerService,
  ],
  // Exports are not typically needed for the root module of a microservice,
  // as nothing imports *from* it within the same application boundary.
})
export class WorkerModule {}