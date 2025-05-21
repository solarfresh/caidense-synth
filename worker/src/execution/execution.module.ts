import { ReasoningThinkingDocument, ReasoningThinkingSchema } from '@caidense/reasoning/thinking/thinking.schemas';
import { ReasoningThinkingService } from '@caidense/reasoning/thinking/thinking.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExecutionConsumer } from './execution.consumer';
import { ExecutionProducer } from './execution.producer';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReasoningThinkingDocument.name, schema: ReasoningThinkingSchema }]),
  ],
  providers: [
    {
      provide: ExecutionConsumer,
      useFactory: (reasoningThinkingService: ReasoningThinkingService) => {
        return new ExecutionConsumer({
          requestQueue: process.env.RABBITMQ_EXECUTE_QUEUE_NAME || 'caidense_execute_queue',
          replyTimeoutMs: parseInt(process.env.RABBITMQ_RPC_TIMEOUT) || 5000, // Default to 5 seconds if not provided
          url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
        }, reasoningThinkingService);
      },
      inject: [ReasoningThinkingService],
    },
    ReasoningThinkingService,
    ExecutionProducer
  ],
  controllers: [],
  exports: [ExecutionProducer, ReasoningThinkingService],
})
export class ExecutionModule {}