import { Variable } from '@caidense/reasoning/common/common.interface';
import { ExecutorBase } from '@caidense/reasoning/executor/executor.service';
import { LLMCallNodeConfig } from '@caidense/reasoning/executor/genai/genai.interface';
import { GoogleGenaiService } from '@caidense/reasoning/executor/genai/google/google.service';
import { ExecutionNodeDto } from '@caidense/reasoning/node/dto/node.dto';
import { ExecutionNodeType } from '@caidense/reasoning/node/node.interface';
import { ExecutionContextTracker } from '@caidense/reasoning/state/state.service';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';


const GenaiServiceMap: Record<string, any> = {
  google: GoogleGenaiService,
};

@Injectable()
export class LLMCallExecutor extends ExecutorBase {
  constructor(
    private readonly moduleRef: ModuleRef
  ){
    super()
  }

  async execute(node: ExecutionNodeDto, tracker: ExecutionContextTracker): Promise<void> {
    if (node.type !== ExecutionNodeType.LLM_CALL) {
      console.error(`LLMCallExecutor received unexpected node type: ${node.type}`);
    }

    const config = node.config as LLMCallNodeConfig;
    const genaiService = await this.moduleRef.resolve(GenaiServiceMap[config.service]);
    const promptText = await this.composePrompt(config.promptTemplate, node, tracker);
    if (!promptText.length) {
      return;
    }
    const response = await genaiService.generateContentFromAiStudio(promptText, config.modelName)
    const results: Record<string, any> = {
      llmOutput: response
    }
    await this.setOutputs(results, node, tracker)
  }

  async composePrompt(promptTemplate: string, node: ExecutionNodeDto, tracker: ExecutionContextTracker): Promise<string> {
    const inputs = await this.getInputs(node, tracker)
    const inputEntries = Object.entries(inputs)
    if (!inputEntries.length) {
      return '';
    }

    return inputEntries.reduce((acc, input) => {
      let [key, value] = input
      return acc.replace(`{{${key}}}`, value)
    }, promptTemplate)
  }
}