import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import * as Joi from 'joi';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
        PORT: Joi.number().default(3000),
        FRONTEND_PORTS: Joi.string().when('NODE_ENV', {
          is: Joi.exist().valid('development'),
          then: Joi.string().required(),
          otherwise: Joi.optional()
        }),
        HOST_PORT: Joi.number().default(3000),
        RABBITMQ_URL: Joi.string().default('amqp://guest:guest@localhost:5672'),
        RABBITMQ_EXECUTE_QUEUE_NAME: Joi.string().default('caidense_execute_queue'),
        RABBITMQ_WORKER_QUEUE_NAME: Joi.string().default('caidense_queue'),
        RABBITMQ_RPC_TIMEOUT: Joi.number().default(5000)
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}