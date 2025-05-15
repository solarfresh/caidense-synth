import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core Modules
import { DatabaseModule } from './database/database.module';

// Feature Modules
// import { ReasoningModule } from '@/modules/reasoning/reasoning.module';
import { GenaiModule } from './modules/genai/genai.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    DatabaseModule,
    GenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [],
})
export class AppModule {}