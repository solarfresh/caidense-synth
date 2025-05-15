
export interface IntermediateThoughtData {
    prompt: string;
    input: string;
    output: string;
    reasoning: string;
    thought: string;
    step: string;
    finalAnswer: string;
    intermediateSteps: string[];
    finalAnswerExtractionMethod: string;
    reasoningStepConfig: string;
    reasoningOutput: string;
    reasoningOutputParser: string;
}

export interface IntermediateThought {
    stepNumber: number;
    data: IntermediateThoughtData;
}

export interface ReasoningStepConfig {
    stepNumber: number;
    promptTemplate: string;
    outputParser: string;
    inputMapping: string;
    outputMapping: string;
    reasoningOutput: string;
    reasoningOutputParser: string;
}

export interface Reasoning {}