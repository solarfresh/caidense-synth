import { AppConfigService } from '@/config/config.service';
import { LLMCallExecutor } from '@caidense/reasoning/executor/genai/genai.service';
import { GoogleGenaiService } from '@caidense/reasoning/executor/genai/google/google.service';
import { ConditionExecutor } from '@caidense/reasoning/executor/generic/condition.service';
import { ScriptExecutor } from '@caidense/reasoning/executor/generic/script.service';
import { SwitchExecutor } from '@caidense/reasoning/executor/generic/switch.service';
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
    AppConfigService,
    {
      provide: ExecutionConsumer,
      useFactory: (
        appConfigService: AppConfigService,
        executionGraphService: ExecutionGraphService,
        reasoningThinkingService: ReasoningThinkingService
      ) => {
        return new ExecutionConsumer({
          requestQueue: appConfigService.get<string>('RABBITMQ_EXECUTE_QUEUE_NAME'),
          replyTimeoutMs: appConfigService.get<number>('RABBITMQ_RPC_TIMEOUT'),
          url: appConfigService.get<string>('RABBITMQ_URL'),
        },
        executionGraphService,
        reasoningThinkingService);
      },
      inject: [AppConfigService, ExecutionGraphService, ReasoningThinkingService],
    },
    ExecutionGraphService,
    ExecutionProducer,
    ConditionExecutor,
    GoogleGenaiService,
    LLMCallExecutor,
    ReasoningThinkingService,
    ScriptExecutor,
    SwitchExecutor,
  ],
  controllers: [],
  exports: [
    AppConfigService,
    ExecutionGraphService,
    ExecutionProducer,
    GoogleGenaiService,
    LLMCallExecutor,
    ReasoningThinkingService,
    ScriptExecutor,
  ],
})
export class ExecutionModule {}