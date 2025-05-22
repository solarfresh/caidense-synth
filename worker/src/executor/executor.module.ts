import { Module } from '@nestjs/common';
import { GoogleGenaiService } from '@caidense/reasoning/executor/genai/google/google.service';
import { LLMCallExecutor } from '@caidense/reasoning/executor/genai/genai.service';


const providers = [
  GoogleGenaiService,
  LLMCallExecutor,
]

@Module({
  providers: providers,
  exports: providers,
})
export class ExecutorModule {}