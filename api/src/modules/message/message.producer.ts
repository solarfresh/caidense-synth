import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class MessageProducer implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly queueName = process.env.RABBITMQ_QUEUE_NAME || 'caidense_queue';
  private readonly rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(this.rabbitmqUrl);
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