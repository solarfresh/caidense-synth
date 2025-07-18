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
        AUTH_HOST_PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string().required().uri(),
        SECRET_SOURCE: Joi.string().valid('file', 'kubernetes', 'aws', 'gcp', 'vault').default('file'),
        JWT_SECRET: Joi.string().when('USE_ASYMMETRIC_KEYS', {
          is: Joi.exist().valid('false'),
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        JWT_PRIVATE_KEY_ID: Joi.string().when('USE_ASYMMETRIC_KEYS', {
          is: Joi.exist().valid('true'),
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        JWT_PUBLIC_KEY_ID: Joi.string().when('USE_ASYMMETRIC_KEYS', {
          is: Joi.exist().valid('true'),
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        USE_ASYMMETRIC_KEYS: Joi.boolean().default(true),
        JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().default('1h'),
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}