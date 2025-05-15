import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { VisionController } from './vision/vision.controller';
// import { VisionService } from './vision/vision.service';
// import { VisionSchema, VisionDocument } from './vision/vision.schemas';
// import { MissionController } from './mission/mission.controller';
// import { MissionService } from './mission/mission.service';
// import { MissionSchema, MissionDocument } from './mission/mission.schemas';
// import { VisionGateway } from './vision/vision.gateway';


@Module({
  imports: [
    // MongooseModule.forFeature([{ name: VisionDocument.name, schema: VisionSchema }]),
    // MongooseModule.forFeature([{ name: MissionDocument.name, schema: MissionSchema }]),
  ],
//   controllers: [VisionController, MissionController],
  controllers: [],
//   providers: [VisionService, MissionService],
  providers: [],
//   exports: [VisionService, MissionService],
  exports: [],
})
export class ReasoningModule {}