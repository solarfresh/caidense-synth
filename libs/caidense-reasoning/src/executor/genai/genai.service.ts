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
    // const response = await genaiService.generateContentFromAiStudio(promptText, config.modelName)
    const response = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: "```json\n{\n  \"thinking_summary\": \"使用者提供了初步的願景相關概念。我的目標是針對這些概念，提出一系列開放式問題，以協助使用者更深入地探索其組織的願景、使命和價值觀。這些問題旨在涵蓋願景的關鍵要素，包括目的、影響、未來狀態、獨特性和價值觀。由於這是首次互動，我會專注於廣泛的探索，為後續的討論奠定基礎。\",\n  \"suggested_direction\": \"請仔細思考以下問題，並盡可能詳細地分享您的想法。您的回答將有助於我們共同塑造一個清晰而有力的組織願景。\",\n  \"response_content\": \"感謝您分享這些關鍵概念！為了更深入地探索，並打造一個真正能激勵人心的願景，請思考以下問題：\\n\\n1.  **目的 (Purpose):** 除了盈利之外，您希望您的組織為世界帶來什麼樣的改變？您希望解決什麼樣的問題？\\n2.  **影響 (Impact):** 您希望您的組織對客戶、員工和整個社會產生什麼樣的正面影響？\\n3.  **未來狀態 (Future State):** 展望未來五年、十年甚至更久，您希望您的組織發展成什麼樣？您希望在行業中扮演什麼樣的角色？\\n4.  **獨特性 (Uniqueness):** 是什麼讓您的組織與眾不同？您希望如何利用這些獨特的優勢來實現您的願景？\\n5.  **價值觀 (Values):** 哪些核心價值觀指導著您的組織？這些價值觀如何在日常工作中體現？\\n6.  **團隊協作 (Teamwork):** 您期望團隊協作在實現願景中扮演什麼樣的角色？如何建立一個鼓勵協作和共同成長的環境？\\n7.  **智能策略管理 (Intelligent Strategy Management):** 如何運用數據和科技，提升策略管理的效率和精準度，從而更好地實現願景？\",\n  \"next_turn_history_payload\": {\n    \"ai_action_summary\": \"提出開放式問題，引導使用者探索願景的關鍵要素。\",\n    \"key_points_from_ai\": \"探索問題涵蓋：目的、影響、未來狀態、獨特性、價值觀、團隊協作、智能策略管理。\"\n  }\n}\n```"
              }
            ],
            role: "model"
          },
          finishReason: "STOP",
          avgLogprobs: -0.24389227353609524
        }
      ],
      modelVersion: "gemini-2.0-flash",
      usageMetadata: {
        promptTokenCount: 495,
        candidatesTokenCount: 520,
        totalTokenCount: 1015,
        promptTokensDetails: [
          {
            modality: "TEXT",
            tokenCount: 495
          }
        ],
        candidatesTokensDetails: [
          {
            modality: "TEXT",
            tokenCount: 520
          }
        ]
      }
    }
    const results: Record<string, any> = {
      llmOutput: response
    }
    this.setOutputs(results, node, tracker)
  }

  async composePrompt(promptTemplate: string, node: ExecutionNodeDto, tracker: ExecutionContextTracker): Promise<string> {
    const inputs = this.getInputs(node, tracker)
    return Object.entries(inputs).reduce((acc, input) => {
      let [key, value] = input
      return acc.replace(`{{${key}}}`, value)
    }, promptTemplate)
  }
}