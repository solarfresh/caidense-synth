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
    let results: Record<string, any> = {};
    if (config.isInference) {
      const genaiService = await this.moduleRef.resolve(GenaiServiceMap[config.service]);
      const promptText = await this.composePrompt(config.promptTemplate, node, tracker);
      if (!promptText.length) {
        return;
      }
      const response = await genaiService.generateContentFromAiStudio(promptText, config.modelName)
      results = {
        llmOutput: response
      }
    } else {
      results = {
        llmOutput: config.promptTemplate
      }
    }

    await this.setOutputs(results, node, tracker)
  }

  async composePrompt(promptTemplate: string, node: ExecutionNodeDto, tracker: ExecutionContextTracker): Promise<string> {
    const inputs = await this.getInputs(node, tracker)

    return promptTemplate.replace(/\{([A-Z0-9_]+)\}/g, (match, varName) => {
      const value = inputs[varName];
      return value !== undefined ? String(value) : match; // Replace or keep original placeholder if not found
    });
  }
}