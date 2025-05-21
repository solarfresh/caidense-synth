import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { BaseRabbitMQService } from '@caidense/reasoning/message/message.service';
import { ExecutionConfig } from '@caidense/reasoning/message/message.interface';


@Injectable()
export class ExecutionConsumer implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly queueName = process.env.RABBITMQ_WORKER_QUEUE_NAME || 'caidense_queue';
  private readonly rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: false });
      console.log(`Consumer connected to RabbitMQ and listening on queue: ${this.queueName}`);

      this.channel.consume(this.queueName, (msg) => {
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