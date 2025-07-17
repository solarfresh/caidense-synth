import { AppConfigService } from '@/config/config.service';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';


@Injectable()
export class ExecutionConsumer implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(
    private appConfigService: AppConfigService,
  ) {}

  async onModuleInit() {
    const queueName = this.appConfigService.get<string>('RABBITMQ_WORKER_QUEUE_NAME');
    const rabbitmqUrl = this.appConfigService.get<string>('RABBITMQ_URL')

    try {
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(queueName, { durable: false });
      console.log(`Consumer connected to RabbitMQ and listening on queue: ${queueName}`);

      this.channel.consume(queueName, (msg) => {
        if (msg !== null) {
          console.log(`Received message: ${msg.content.toString()}`);
          this.channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('Failed to connect to RabbitMQ or assert queue for consumer:', error);
    }
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    console.log('Consumer disconnected from RabbitMQ.');
  }
}