import { Module, Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { WorkerService } from './worker.service'; // Service to handle incoming messages and orchestrate execution
import { NodeExecutorRegistry } from './execution/executor.registry'; // Registry for node executors
import { NodeExecutor } from '../interfaces/executor.interface';
// Import specific node executor implementations provided by this worker
// Add more executors here as you implement different node types
// import { AiCallExecutor } from './flow-execution/executors/ai-call.executor';
// import { SumCompareExecutor } from './flow-execution/executors/sum-compare.executor';
// ... import other executors (EXCEPT the ScriptNodeExecutor which calls the sandbox)


@Module({
  imports: [
    // Configure ConfigModule to load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make configuration available globally within this worker
      // envFilePath: ['./.env', './docker-var.env'], // Specify env files if needed
    }),
    // ... import other modules required by executors (e.g., HttpModule, MongooseModule if needed, but generally keep workers stateless)
  ],
  controllers: [
    // Controllers containing @MessagePattern handlers for incoming RabbitMQ messages
    // WorkerService itself might contain these handlers and be listed in providers only,
    // or you might have a dedicated controller. Let's list WorkerService in providers
    // and assume it has the @MessagePattern handlers.
  ],
  providers: [
    // The main service that consumes messages and orchestrates execution
    WorkerService,
    // Provide all specific node executor implementations
    // AiCallExecutor,
    // SumCompareExecutor,
    // ... list other executors here

    // Provide the NodeExecutorRegistry and populate it with executors
    {
      provide: NodeExecutorRegistry, // Provide the registry class
      useFactory: (...executors: NodeExecutor[]) => {
        // Use useFactory to inject all executor instances and build the registry
        const registry = new NodeExecutorRegistry();
        executors.forEach(executor => {
          // We need a way to get the 'type' string from each executor.
          // Executors should ideally have a static 'type' property or a method.
          // Example assuming a static 'type' property:
          if ((executor as any).type) {
             registry.register((executor as any).type, executor);
          } else {
             console.warn(`Executor ${executor.constructor.name} does not have a static 'type' property.`);
             // Handle executors that might not have a simple static type (e.g., ScriptNodeExecutor)
             // ScriptNodeExecutor would typically be registered under a specific type like 'systemLogic:script'
             // And it needs the SANDBOX_SERVICE ClientProxy injected.
             // If ScriptNodeExecutor exists here, it would also be listed above and handled here.
             // Example for ScriptNodeExecutor:
             // if (executor instanceof ScriptNodeExecutor) {
             //    registry.register('systemLogic:script', executor);
             // }
          }
        });
         console.log(`NodeExecutorRegistry initialized with ${registry.getExecutorTypes().length} types.`);
         // console.log('Registered types:', registry.getExecutorTypes());
        return registry;
      },
      // Inject all executor providers listed above into the factory function
      inject: [
        // List all executor classes here that you want to inject into the factory
        // AiCallExecutor,
        // SumCompareExecutor,
      ],
    },
  ],
  // Exports are not typically needed for the root module of a microservice,
  // as nothing imports *from* it within the same application boundary.
})
export class WorkerModule {}