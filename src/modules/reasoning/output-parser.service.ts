// /**
//  * Provides methods for parsing and interpreting the raw text output from LLMs,
//  * specifically for extracting structured information or final answers from reasoning outputs.
//  */
// export class OutputParserService {

//   /**
//    * @summary Parses the raw LLM output based on a defined format or extraction method.
//    * @param rawOutput - The raw string output from the LLM.
//    * @param parseConfig - Configuration specifying how to parse the output (e.g., regex, JSON path, keyword search).
//    * @returns The parsed and structured data or extracted value.
//    * @throws Error if parsing fails.
//    */
//   parseReasoningOutput(rawOutput: string, parseConfig: OutputParseConfig): any {
//     // ... Delegates to specific parsing methods based on config ...
//   }

//    /**
//    * @summary Extracts the definitive final answer from a verbose reasoning output.
//    * @param output - The raw string output potentially containing intermediate steps.
//    * @param method - The method to use for extraction (e.g., finding text after "Final Answer:", JSON key).
//    * @returns The extracted final answer string.
//    */
//    extractFinalAnswer(output: string, method: FinalAnswerExtractionMethod): string {
//       // ... Implementation based on method ...
//    }

//    /**
//    * @summary Extracts data from an intermediate step's output to be used as input for the next step.
//    * @param output - The raw string output from an intermediate LLM call.
//    * @param stepConfig - Configuration for the step, including how to extract next input.
//    * @returns The extracted data formatted for the next step's input.
//    */
//    extractIntermediateStepData(output: string, stepConfig: ReasoningStepConfig): any {
//       // ... Implementation based on stepConfig extraction rules ...
//    }

//   // --- Internal Parsing Methods (Examples) ---

//   // private parseJsonOutput(output: string, jsonPath?: string): any { ... }
//   // private extractByRegex(output: string, regex: string): string | null { ... }
//   // private findTextAfter(output: string, marker: string): string | null { ... }
// }
