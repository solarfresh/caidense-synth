import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core Modules
import { AppConfigModule } from '@/config/config.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { DatabaseModule } from '@caidense/reasoning/database/database.module';

// Feature Modules
import { PromptModule } from '@/modules/prompt/prompt.module';
import { ReasoningModule } from '@/modules/reasoning/reasoning.module';
import { ExecutionModule } from './modules/execution/execution.module';
import { GenaiModule } from './modules/genai/genai.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    DatabaseModule,
    AppConfigModule,
    AuthModule,
    PromptModule,
    ReasoningModule,
    GenaiModule,
    ExecutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [],
})
export class AppModule {}