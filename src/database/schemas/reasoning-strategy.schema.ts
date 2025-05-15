// // src/database/schemas/reasoning-strategy.schema.ts

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';
// import { IntermediateThoughtData } from '../../modules/shared/interfaces/reasoning.interface';

// export type ReasoningStrategyDocument = HydratedDocument<ReasoningStrategy>;

// /**
//  * @summary Defines the structure for a Reasoning Strategy document in the database.
//  * @description Represents a blueprint or a predefined plan for executing a multi-step
//  * Large Language Model (LLM) reasoning process, such as Chain of Thought (CoT),
//  * Tree of Thoughts, or other structured reasoning flows.
//  *
//  * Each ReasoningStrategy document specifies the sequence of steps, the prompt template
//  * to be used at each step, how to process the output from one step, and how that
//  * processed output should map to the input for the subsequent step in the chain.
//  *
//  * These documents are stored and managed in the database to allow for the definition,
//  * versioning, and reuse of different reasoning approaches across the platform.
//  * They serve as the configuration for the Reasoning Orchestrator Service.
//  */
// @Schema({ timestamps: true }) // timestamps: true automatically adds createdAt and updatedAt fields
// export class ReasoningStrategy {
//   /**
//    * @summary A unique, human-readable name identifier for the reasoning strategy.
//    * @example "Standard_CoT_for_Math_Problems"
//    */
//   @Prop({ required: true, unique: true })
//   name: string = '';

//   /**
//    * @summary A brief description explaining the purpose and intended use case of this strategy.
//    */
//   @Prop()
//   description?: string;

//   /**
//    * @summary An ordered array of steps defining the reasoning chain.
//    * @description Each object in the array contains the configuration for a single step,
//    * including the prompt template to use, output parsing rules, and input mapping for the next step.
//    * The structure of each step object should conform to a defined interface (e.g., ReasoningStepConfig).
//    */
//   @Prop({ type: [Object], required: true }) // 使用 [Object] 表示一個對象陣列，如果需要更嚴格的類型檢查，應定義子 Schema 或接口並在此引用
//   steps: IntermediateThoughtData[] = [];

//   /**
//    * @summary The version number of this reasoning strategy definition.
//    * @description Used for tracking changes and allowing concurrent versions.
//    * @default 1
//    */
//   @Prop({ default: 1 })
//   version: number = 1;

//   /**
//    * @summary Optional ID linking this strategy to a specific application use case or feature.
//    * @description Helps in organizing strategies by where they are applied within the platform.
//    */
//   @Prop({ type: String }) // Or SchemaTypes.ObjectId if linking to a UseCase entity/schema
//   useCaseId?: string; // Or Types.ObjectId

//   /**
//    * @summary Indicates if this strategy is active and available for use.
//    * @default true
//    */
//   @Prop({ default: true })
//   isActive: boolean = true;

//   // Mongoose automatically manages 'createdAt' and 'updatedAt' fields due to { timestamps: true }
// }

// export const ReasoningStrategySchema = SchemaFactory.createForClass(ReasoningStrategy);

// // Optional: Add Mongoose schema plugins, indexes, virtuals, methods, or static methods here
// ReasoningStrategySchema.index({ name: 1, version: 1 }, { unique: true }); // Example compound unique index
