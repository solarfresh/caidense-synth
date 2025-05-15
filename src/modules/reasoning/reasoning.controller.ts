// /**
//  * Manages the recording and retrieval of intermediate thoughts for active or completed reasoning runs.
//  */

// import { IntermediateThought, IntermediateThoughtData } from './reasoning.interface';
// import { BaseController } from '@/modules/base/base.controller';
// import { DocumentStatus } from '@/modules/base/base.interface';
// import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
// import { CreateReasoningDto } from './dto/create-reasoning.dto';
// import { UpdateReasoningDto } from './dto/update-reasoning.dto';
// import { ReasoningDocument } from './reasoning.schemas';
// import { ReasoningService } from './reasoning.service';


// // export class IntermediateThoughtManager {
// //     // Assuming storage mechanism (e.g., Map for in-memory, or injected Repository for DB)
// //     // private thoughts: Map<string, IntermediateThought[]>; // Example for in-memory
// //     private thoughts: Map<string, IntermediateThought[]> = new Map<string, IntermediateThought[]>(); // Example for in-memory

// //     /**
// //      * @summary Initializes storage for a new reasoning run's thoughts.
// //      * @param runId - The ID of the new reasoning run.
// //      */
// //     startNewRun(runId: string): void {
// //         // ... Initialize storage for runId ...
// //         this.thoughts.set(runId, []);
// //     }

// //     /**
// //      * @summary Adds details of a completed step to the thoughts for a specific run.
// //      * @param runId - The ID of the reasoning run.
// //      * @param stepNumber - The sequence number of the step.
// //      * @param data - The data to record (prompt, input, output, etc.).
// //      */
// //     addThoughtStep(runId: string, stepNumber: number, data: IntermediateThoughtData): void {
// //         // ... Add data to storage for runId and stepNumber ...
// //         const thought: IntermediateThought = {
// //             stepNumber,
// //             data,
// //         };
// //         const existingThoughts = this.thoughts.get(runId) || [];
// //         existingThoughts.push(thought);
// //         this.thoughts.set(runId, existingThoughts);
// //     }

// //     /**
// //      * @summary Retrieves all recorded thought steps for a given reasoning run.
// //      * @param runId - The ID of the reasoning run.
// //      * @returns A list of intermediate thought steps.
// //      */
// //     getThoughtsForRun(runId: string): IntermediateThought[] {
// //         // ... Retrieve data from storage for runId ...
// //         return this.thoughts.get(runId) || [];
// //     }

// //     /**
// //      * @summary Removes the in-memory thoughts for a run (e.g., after persistence).
// //      * @param runId - The ID of the reasoning run.
// //      */
// //     clearRunThoughts(runId: string): void {
// //          // ... Remove data from in-memory storage ...
// //         this.thoughts.delete(runId);
// //     }

// //     // ... potentially method to trigger saving to DB if not done step-by-step ...
// //     // async saveRunThoughts(runId: string): Promise<void> { ... }
// // }

// @Controller('reasoning')
// export class ReasoningController extends BaseController<ReasoningDocument, ReasoningService> {
//   constructor(
//       private readonly reasoningService: ReasoningService, // Inject the specific service
//   ) {
//     super(reasoningService);
//    }

//   @Post()
//   async create(@Body(ValidationPipe) createReasoningDto: CreateReasoningDto): Promise<ReasoningDocument> {
//     return super.create(createReasoningDto);
//   }

//   @Get()
//   async findAll(): Promise<ReasoningDocument[]> {
//      return super.findAll();
//   }

//   @Get(':id')
//   async findById(@Param('id') id: string): Promise<ReasoningDocument> {
//      return super.findById(id);
//   }

//   @Put(':id')
//   async update(@Param('id') id: string, @Body(ValidationPipe) updateReasoningDto: UpdateReasoningDto): Promise<ReasoningDocument> {
//      return super.update(id, updateReasoningDto);
//   }

//   @Delete(':id')
//   async deleteOne(@Param('id') id: string): Promise<void> {
//     await super.deleteOne(id);
//   }

//   // Customized endpoints can be added here.
// }
