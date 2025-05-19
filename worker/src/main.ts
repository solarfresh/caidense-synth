import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WorkerModule } from './worker.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();
  const rabbitmqUrl = configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672';

  const queueName = configService.get<string>('RABBITMQ_SPECIFIC_QUEUE') || 'default_queue';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: queueName, // 根據服務不同
        queueOptions: {
          durable: true,
          noAck: false,
        },
      },
    },
  );

  await app.listen();

  console.log(`█ Your Specific Microservice is listening on RabbitMQ queue: "${queueName}"`);
}

bootstrap();