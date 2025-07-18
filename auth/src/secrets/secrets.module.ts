import { AppConfigModule } from '@/config/config.module';
import { Module } from '@nestjs/common';
import { SecretsService } from './secrets.service';


@Module({
  imports: [AppConfigModule], // SecretsService needs AppConfigService
  providers: [SecretsService],
  exports: [SecretsService],
})
export class SecretsModule {}