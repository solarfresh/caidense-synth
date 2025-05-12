/**
 * Service responsible for interacting with LLM providers via LangChain.js.
 */
export class LLMService {
  // ... other methods ...

  /**
   * @summary Sends a prompt to the configured LLM and returns the response.
   * @param prompt - The prompt string or ChatMessage array.
   * @param options - Options for the LLM call (e.g., model name, temperature).
   * @returns The response from the LLM.
   * @throws Error if the LLM call fails.
   */
  async callLLM(prompt: string | any[], options?: LLMCallOptions): Promise<LLMResponse> {
    // ... LangChain.js call implementation ...
  }
}
