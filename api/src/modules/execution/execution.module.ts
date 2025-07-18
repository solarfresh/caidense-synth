import { AppConfigService } from '@/config/config.service';
import { ExecutionConfig } from '@caidense/reasoning/message/message.interface';
import { Module } from '@nestjs/common';
import { ExecutionConsumer } from './execution.consumer';
import { ExecutionController } from './execution.controller';
import { ExecutionProducer } from './execution.producer';


@Module({
  providers: [
    AppConfigService,
    ExecutionConsumer,
    {
      provide: ExecutionProducer,
      useFactory: (
        appConfigService: AppConfigService,
      ) => {
        return new ExecutionProducer({
          requestQueue: appConfigService.get<string>('RABBITMQ_EXECUTE_QUEUE_NAME'),
          replyTimeoutMs: appConfigService.get<number>('RABBITMQ_RPC_TIMEOUT'),
          url: appConfigService.get<string>('RABBITMQ_URL'),
        } as ExecutionConfig);
      },
      inject: [AppConfigService],
    },
  ],
  controllers: [ExecutionController],
  exports: [AppConfigService, ExecutionProducer],
})
export class ExecutionModule {}