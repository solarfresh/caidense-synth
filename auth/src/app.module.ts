import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core Modules
import { DatabaseModule } from '@caidense/reasoning/database/database.module';
import { AppConfigModule } from '@/config/config.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ClientsModule } from '@/modules/clients/clients.module';

// Feature Modules


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    DatabaseModule,
    AppConfigModule,
    AuthModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [],
})
export class AppModule {}