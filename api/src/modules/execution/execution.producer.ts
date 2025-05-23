import { ExecutionConfig } from '@caidense/reasoning/message/message.interface';
import { BaseRabbitMQService } from '@caidense/reasoning/message/message.service';
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class ExecutionProducer extends BaseRabbitMQService {
  private readonly requestQueue: string;
  private replyQueue: string;
  private correlationIdEmitter = new EventEmitter();
  private readonly replyTimeoutMs: number;

  constructor(config: ExecutionConfig) {
    super(config);
    this.requestQueue = config.requestQueue;
    this.replyTimeoutMs = config.replyTimeoutMs || 5000; // Default to 5 seconds if not provided
  }

  protected async setupChannel(channel: amqp.Channel): Promise<void> {
    await channel.assertQueue(this.requestQueue, { durable: false });

    // Create a temporary queue for replies
    const q = await this.channel.assertQueue('', { exclusive: true, durable: false, autoDelete: true });
    this.replyQueue = q.queue;
    console.log(`[RequesterService] Reply queue created: ${this.replyQueue}`);

    this.channel.consume(
      this.replyQueue,
      (msg) => {
        if (msg !== null && msg.properties.correlationId) {
          const correlationId = msg.properties.correlationId;
          const content = msg.content.toString();
          this.correlationIdEmitter.emit(correlationId, content);

          this.channel.ack(msg);
        }
      },
      { noAck: false }
    );
    console.log(`[RequesterService] Connected and listening on reply queue: ${this.replyQueue}`);
  }

  async sendMessage(message: object) {
    if (!this.channel) {
      console.error('RabbitMQ channel is not initialized for producer.');
      return;
    }

    const correlationId = uuidv4();
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.correlationIdEmitter.removeListener(correlationId, onResponse);
        reject(new Error('RPC request timed out'));
      }, this.replyTimeoutMs);

      const onResponse = (response: string) => {
        clearTimeout(timeout);
        try {
          console.log(`[RequesterService] Received response: ${response}`);
          resolve(JSON.parse(response));
        } catch (error) {
          reject(new Error(`Failed to parse response: ${response}`));
        }
        this.correlationIdEmitter.removeListener(correlationId, onResponse);
      };
      this.correlationIdEmitter.once(correlationId, onResponse);

      const stringifiedMessage = JSON.stringify(message)
      this.channel.sendToQueue(
        this.requestQueue,
        Buffer.from(stringifiedMessage),
        {
          correlationId,
          replyTo: this.replyQueue,
        }
      );
      console.log(`[RequesterService] Sent request for ${stringifiedMessage} with correlationId: ${correlationId}`);
    });
  }
}