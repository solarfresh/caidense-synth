import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQConfig } from './message.interface';


@Injectable()
export abstract class BaseRabbitMQService implements OnModuleInit, OnModuleDestroy {
  protected connection: amqp.Connection;
  protected channel: amqp.Channel;
  protected config: RabbitMQConfig;

  protected abstract setupChannel(channel: amqp.Channel): Promise<void>;

  constructor(config: RabbitMQConfig) {
    this.config = config;
  }

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(this.config.url);
      this.channel = await this.connection.createChannel();

      if (this.config.exchangeName && this.config.exchangeType) {
        await this.channel.assertExchange(this.config.exchangeName, this.config.exchangeType, { durable: false });
        console.log(`[BaseRabbitMQService] Asserted exchange: ${this.config.exchangeName} (${this.config.exchangeType})`);
      }

      if (this.config.queueName) {
        await this.channel.assertQueue(this.config.queueName, { durable: false });
        console.log(`[BaseRabbitMQService] Asserted queue: ${this.config.queueName}`);
      }

      if (this.config.prefetchCount !== undefined) {
        this.channel.prefetch(this.config.prefetchCount);
        console.log(`[BaseRabbitMQService] Channel prefetch set to: ${this.config.prefetchCount}`);
      }

      await this.setupChannel(this.channel);

      console.log(`[BaseRabbitMQService] Connected to RabbitMQ at ${this.config.url}`);
    } catch (error) {
      console.error(`[BaseRabbitMQService] Failed to connect to RabbitMQ or setup:`, error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
        console.log('[BaseRabbitMQService] Channel closed.');
      }
      if (this.connection) {
        await this.connection.close();
        console.log('[BaseRabbitMQService] Connection closed.');
      }
    } catch (error) {
      console.error('[BaseRabbitMQService] Error closing RabbitMQ resources:', error);
    }
  }
}