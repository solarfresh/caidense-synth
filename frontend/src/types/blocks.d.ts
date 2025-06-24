export enum BlockType {
  LLM_CALL = 'llmCall',
  START_EVENT = 'startEvent',
  END_EVENT = 'endEvent',
  SCRIPT = 'script',
}

interface BlockConfig {
  // LLM_CALL Config
  modelName?: string;
  promptTemplate?: string;
  promptTemplateId?: string;
  provider?: string;
  // SCRIPT Config
  script?: string;
  [key: string]: any;
}

export interface Block {
  /**
   * A readable name for the block
   */
  name: string;

  /**
   * To describe the purpose or functionality of the block.
   */
  description: string;

  /**
   * The type of the block, determining its function and behavior in the flow.
   * This could be a system-defined type (e.g., 'start', 'end', 'systemLogic', 'aiCall')
   * or a custom type representing specific logic (e.g., 'promptNode', 'decisionNode').
   * @example 'aiCall'
   */
  type: string;

  /**
   * An optional label or name displayed on the node in a visual representation.
   * @example 'Call System_Text_Analyzer'
   */
  label?: string;

  /**
   * Optional configuration object specific to this node's type.
   * Contains parameters needed for the node's execution logic.
   * @example { templateId: 'abc123', analysisType: 'criteria_evaluation' }
   */
  config?: BlockConfig;

  /**
   * The timestamp when the node was created.
   */
  createdAt: Date;

  /**
   * The timestamp when the node was last updated.
   */
  updatedAt: Date;
}