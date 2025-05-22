import { Variable } from '@caidense/reasoning/common/common.interface';
import { ExecutorBase } from '@caidense/reasoning/executor/executor.service';
import { LLMCallNodeConfig } from '@caidense/reasoning/executor/genai/genai.interface';
import { GoogleGenaiService } from '@caidense/reasoning/executor/genai/google/google.service';
import { ExecutionNode, ExecutionNodeType } from '@caidense/reasoning/node/node.interface';
import { ExecutionContextTracker } from '@caidense/reasoning/state/state.service';
import { PromptTemplate } from "@langchain/core/prompts";
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';


const GenaiServiceMap: Record<string, any> = {
  'google': GoogleGenaiService,
};

@Injectable()
export class LLMCallExecutor extends ExecutorBase {
  constructor(
    private readonly moduleRef: ModuleRef
  ){
    super()
  }

  async execute(node: ExecutionNode, tracker: ExecutionContextTracker): Promise<void> {
    if (node.type !== ExecutionNodeType.LLM_CALL) {
      console.error(`LLMCallExecutor received unexpected node type: ${node.type}`);
    }

    const config = node.config as LLMCallNodeConfig;
    const genaiService = await this.moduleRef.resolve(GenaiServiceMap[config.service]);
    const promptTemplate = PromptTemplate.fromTemplate(config.promptTemplate)
    const promptVariables = await this.convertToPromptVariables(node.inputs)
    const promptText = await promptTemplate.invoke(promptVariables);
    const result = await genaiService.generateContentFromAiStudio(promptText, config.modelName)
    tracker.setVariable('outputs', [result])
  }

  async convertToPromptVariables(variables: Variable[]): Promise<Record<string, string>> {
    return variables.reduce((acc, variable) => {
      if (variable.type === 'string') {
        acc[variable.name] = variable.value
        return acc
      }
    }, {})
  }
}