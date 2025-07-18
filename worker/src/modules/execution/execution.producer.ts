import { AppConfigService } from '@/config/config.service';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class ExecutionProducer implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private queueName: string;

  constructor(
    private appConfigService: AppConfigService,
  ) {}

  async onModuleInit() {
    const rabbitmqUrl = this.appConfigService.get<string>('RABBITMQ_URL')
    this.queueName = this.appConfigService.get<string>('RABBITMQ_WORKER_QUEUE_NAME');

    try {
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: false });
      console.log(`Producer connected to RabbitMQ and ready to send to queue: ${this.queueName}`);
    } catch (error) {
      console.error('Failed to connect to RabbitMQ or assert queue for producer:', error);
    }
  }

  async sendMessage(message: string) {
    if (!this.channel) {
      console.error('RabbitMQ channel is not initialized for producer.');
      return;
    }
    this.channel.sendToQueue(this.queueName, Buffer.from(message));
    console.log(`Sent message: "${message}" to queue: ${this.queueName}`);
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    console.log('Producer disconnected from RabbitMQ.');
  }
}