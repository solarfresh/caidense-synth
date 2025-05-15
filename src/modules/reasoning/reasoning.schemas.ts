// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';
// import { Reasoning } from './reasoning.interface';
// import { DocumentStatus } from '@/modules/base/base.interface';


// @Schema({
//   timestamps: true,
//   toJSON: {
//     virtuals: true,
//   },
// })
// export class ReasoningDocument extends Document implements Reasoning {
//   @Prop({ type: String, enum: ['draft', 'finalized'], default: 'draft' })
//   status: DocumentStatus;
//   @Prop(Date)
//   createdAt: Date;
//   @Prop(Date)
//   updatedAt: Date;
// }

// export const ReasoningSchema = SchemaFactory.createForClass(ReasoningDocument);
