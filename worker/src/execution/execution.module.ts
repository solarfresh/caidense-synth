import { ReasoningThinkingDocument, ReasoningThinkingSchema } from '@caidense/reasoning/thinking/thinking.schemas';
import { ReasoningThinkingService } from '@caidense/reasoning/thinking/thinking.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExecutionConsumer } from './execution.consumer';
import { ExecutionGraphService } from './execution.graph.service';
import { ExecutionProducer } from './execution.producer';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReasoningThinkingDocument.name, schema: ReasoningThinkingSchema }]),
  ],
  providers: [
    {
      provide: ExecutionConsumer,
      useFactory: (
        executionGraphService: ExecutionGraphService,
        reasoningThinkingService: ReasoningThinkingService
      ) => {
        return new ExecutionConsumer({
          requestQueue: process.env.RABBITMQ_EXECUTE_QUEUE_NAME || 'caidense_execute_queue',
          replyTimeoutMs: parseInt(process.env.RABBITMQ_RPC_TIMEOUT) || 5000, // Default to 5 seconds if not provided
          url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
        },
        executionGraphService,
        reasoningThinkingService);
      },
      inject: [ExecutionGraphService, ReasoningThinkingService],
    },
    ExecutionGraphService,
    ExecutionProducer,
    ReasoningThinkingService
  ],
  controllers: [],
  exports: [ExecutionGraphService, ExecutionProducer, ReasoningThinkingService],
})
export class ExecutionModule {}