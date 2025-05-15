/**
 * Service responsible for managing prompt templates.
 */
export class PromptService {
   // ... other methods ...

   /**
   * @summary Retrieves a specific prompt template by its ID.
   * @param id - The ID of the prompt template.
   * @returns The prompt template definition.
   * @throws NotFoundException if the prompt is not found.
   */
   async getPromptTemplateById(id: string): Promise<PromptTemplate> {
      // ... Calls PromptRepository to fetch ...
   }

   // If using a separate PromptTemplateModule for complex rendering:
   // async renderPrompt(templateId: string, variables: any): Promise<string | any[]> { ... }
}
