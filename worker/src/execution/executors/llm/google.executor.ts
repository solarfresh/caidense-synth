// src/modules/flow-execution/executors/llm-call.executor.ts

import { Injectable } from '@nestjs/common';
import { INodeExecutor } from '../interfaces/node-executor.interface'; // 假設的 Executor 介面
import { FlowExecutionContext } from '../interfaces/flow-execution-context.interface'; // 假設的 Context 介面
import { IThinkingNode } from '@/modules/reasoning/thinking/thinking.interface'; // 假設的 Node 介面
import { LLMService } from '@/modules/llm/llm.service'; // 假設的 LLM 服務，負責與 LLM 提供者通信
import { PromptService } from '@/modules/prompt/prompt.service'; // 假設的 Prompt 服務，用於獲取 Prompt 模板

// 假設的節點 config 結構
interface LLMCallNodeConfig {
  templateId: string; // 要使用的 Prompt Template ID
  modelName?: string; // 可選的 LLM 模型名稱
  apiParams?: Record<string, any>; // 可選的 LLM API 參數 (e.g., temperature, maxTokens)
  inputMapping: Record<string, string>; // 數據從 Context 映射到 Prompt 模板變數的規則
  outputMapping: Record<string, string>; // 數據從 LLM 輸出映射回 Context 的規則
}

@Injectable()
export class LLMCallExecutor implements INodeExecutor {
  // 註冊中心會將 LLMService 注入到這個 Executor
  constructor(
    private readonly llmService: LLMService, // 負責 LLM API 呼叫
    private readonly promptService: PromptService, // 負責獲取 Prompt 模板
    // ... 可能還需要注入其他必要的服務，如日誌服務
  ) {}

  /**
   * 執行一個 LLM API 呼叫節點的邏輯。
   * @param node 當前要執行的 LLM 呼叫節點定義。
   * @param context 當前流程的執行上下文。
   * @returns 包含更新後狀態的流程執行上下文。
   */
  async execute(
    node: IThinkingNode,
    context: FlowExecutionContext,
  ): Promise<FlowExecutionContext> {
    // 確保節點類型和配置是我們期望的
    if (node.type !== 'aiCall' && node.type !== 'llmCall') {
      // 記錄錯誤或拋出異常
      console.error(`LLMCallExecutor received unexpected node type: ${node.type}`);
      // 或者將錯誤信息添加到 context 中
      context.addError(node._id, `Executor received unexpected node type: ${node.type}`);
      // 根據錯誤處理策略，可能需要設置 nextNodeIds 到錯誤處理節點
      // context.nextNodeIds = [context.getErrorHandlerNodeId()];
      return context; // 返回當前上下文
    }

    // 將 config 斷言為具體類型，以便訪問屬性
    const config = node.config as LLMCallNodeConfig;

    if (!config || !config.templateId || !config.inputMapping || !config.outputMapping) {
       console.error(`LLMCall node ${node._id} is missing required configuration.`);
       context.addError(node._id, 'Missing required LLM call configuration.');
       // ... 錯誤處理
       return context;
    }

    try {
      // 步驟 1: 從 Context 提取數據並構建 Prompt 輸入
      // 這部分需要一個通用的映射函數，根據 config.inputMapping
      // 從 context.flowVariables, context.currentPayload 等地方獲取數據
      const promptInputData = this.mapDataFromContext(config.inputMapping, context);

      // 步驟 2: 獲取 Prompt 模板 (可能從 PromptService 獲取)
      // 在更複雜的實現中，PromptService 可能直接根據 templateId 和數據構建最終 Prompt 字符串
      // const promptTemplate = await this.promptService.getTemplateById(config.templateId);
      // const finalPrompt = this.promptService.buildPrompt(promptTemplate, promptInputData);

      // 步驟 3: 呼叫 LLM 服務
      // 假定 llmService.callLLM 負責根據 templateId, data, modelName, apiParams 呼叫外部 API
      const llmResponse = await this.llmService.callLLM(
        config.templateId, // 或直接傳遞 finalPrompt
        promptInputData,
        config.modelName,
        config.apiParams,
      );

      // 檢查 LLM 回應是否成功並包含預期的輸出結構
      if (!llmResponse || !llmResponse.success || !llmResponse.outputData) {
         console.error(`LLM call to template ${config.templateId} failed or returned invalid data.`);
         context.addError(node._id, 'LLM call failed or returned invalid data.');
         // ... 錯誤處理
         return context;
      }

      // 步驟 4: 將 LLM 的輸出數據寫回 Context
      // 這部分需要另一個通用的映射函數，根據 config.outputMapping
      // 將 llmResponse.outputData (假定是 JSON) 寫入 context.flowVariables 或 context.currentPayload
      this.mapDataToContext(config.outputMapping, llmResponse.outputData, context);

      // 步驟 5: 記錄執行成功
      context.addLog(node._id, 'LLM call executed successfully.');

      // Executor 通常不直接設置 nextNodeIds，這是由流程狀態服務根據邊和節點輸出的數據決定的。
      // 但如果這個節點本身包含分支邏輯，則可以在這裡根據 llmResponse 的內容來設置 nextNodeIds。
      // 例如：
      // if (llmResponse.outputData.decision === 'approve') {
      //    context.nextNodeIds = [config.nextNodes.approve];
      // } else {
      //    context.nextNodeIds = [config.nextNodes.reject];
      // }

      // 返回更新後的上下文
      return context;

    } catch (error: any) {
      // 捕獲呼叫 LLM 服務過程中的錯誤
      console.error(`Error executing LLM call node ${node._id}:`, error);
      context.addError(node._id, `Error during LLM call: ${error.message}`);
      // ... 錯誤處理，可能需要標記流程實例為失敗或跳轉到錯誤處理節點
      // context.nextNodeIds = [context.getErrorHandlerNodeId()];
      return context;
    }
  }

  // --- 輔助映射函數 (概念性實現) ---
  // 這些函數會遍歷映射規則，從源對象讀取數據並寫入目標對象

  private mapDataFromContext(mapping: Record<string, string>, context: FlowExecutionContext): Record<string, any> {
      const inputData: Record<string, any> = {};
      // 實際實現會更複雜，需要解析 mapping value (e.g., "{{flowVariables.varA}}")
      // 並從 context 中對應的路徑獲取數據
      // 這裡只是一個簡化示例
      for (const key in mapping) {
          const path = mapping[key];
          // 假設有一個 helper 函數可以根據路徑獲取 context 中的值
          inputData[key] = this.getValueFromPath(context, path);
      }
      return inputData;
  }

   private mapDataToContext(mapping: Record<string, string>, sourceData: Record<string, any>, context: FlowExecutionContext): void {
      // 實際實現會更複雜，需要解析 mapping key (e.g., "{{output.analysis_result.vision_criteria_evaluation}}")
      // 並將 sourceData 中對應路徑的值寫入 context 中的目標路徑
      // 這裡只是一個簡化示例
       for (const path in mapping) {
           const targetPath = mapping[path];
           // 假設有一個 helper 函數可以根據路徑獲取 sourceData 中的值
           const valueToSet = this.getValueFromPath(sourceData, path);
           // 假設有一個 helper 函數可以根據路徑將值寫入 context 中
           this.setValueToPath(context, targetPath, valueToSet);
       }
   }

   // 假設的 Helper 函數，用於根據路徑從對象中讀取值 (需要更健壯的實現)
   private getValueFromPath(source: any, path: string): any {
       // 簡單示例，只處理點分隔路徑和 {{...}} 語法
       if (path.startsWith('{{') && path.endsWith('}}')) {
           path = path.substring(2, path.length - 2);
       }
       const parts = path.split('.');
       let current = source;
       for (const part of parts) {
           if (current === undefined || current === null) return undefined;
           current = current[part];
       }
       return current;
   }

    // 假設的 Helper 函數，用於根據路徑將值寫入對象中 (需要更健壯的實現)
   private setValueToPath(target: any, path: string, value: any): void {
        // 簡單示例，只處理點分隔路徑
        const parts = path.split('.');
        let current = target;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                current[part] = value;
            } else {
                 if (current[part] === undefined || current[part] === null || typeof current[part] !== 'object') {
                     current[part] = {}; // 如果中間路徑不存在，創建空對象
                 }
                 current = current[part];
            }
        }
   }
}