import { ExecutionNodeConfig } from '@caidense/reasoning/node/node.interface'


export interface LLMCallNodeConfig extends ExecutionNodeConfig {
  promptTemplate: string,
  service: string,
  modelName: string
}