import { Module } from '@nestjs/common';
import { ExecutionConsumer } from './execution.consumer';
import { ExecutionProducer } from './execution.producer';


@Module({
  providers: [
    {
      provide: ExecutionConsumer,
      useFactory: () => {
        return new ExecutionConsumer({
          requestQueue: process.env.RABBITMQ_EXECUTE_QUEUE_NAME || 'caidense_execute_queue',
          replyTimeoutMs: parseInt(process.env.RABBITMQ_RPC_TIMEOUT) || 5000, // Default to 5 seconds if not provided
          url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
        });
      }
    },
    ExecutionProducer
  ],
  controllers: [],
  exports: [ExecutionProducer],
})
export class ExecutionModule {}