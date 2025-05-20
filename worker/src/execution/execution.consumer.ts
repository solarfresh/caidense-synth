import { ExecutionConfig, ExecutionRequestHandler } from '@caidense/reasoning/message/message.interface';
import { BaseRabbitMQService } from '@caidense/reasoning/message/message.service';
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';


@Injectable()
export class ExecutionConsumer extends BaseRabbitMQService {
  private readonly requestQueue: string;

  private requestHandler: ExecutionRequestHandler<any, any> = async (data, msg, channel) => {
    // Default request handler implementation
    console.log(`[WorkerService] Handling request: ${JSON.stringify(data)}`);
    return { result: 'success' };
  };

  constructor(config: ExecutionConfig) {
    super(config);
    this.requestQueue = config.requestQueue;
  }

  protected async setupChannel(channel: amqp.Channel): Promise<void> {
    await channel.assertQueue(this.requestQueue, { durable: false });
    // Set QoS to 1 to ensure that the consumer only processes one message at a time
    this.channel.prefetch(1);
    console.log(`[WorkerService] Listening for requests on queue: ${this.requestQueue}`);

    if (this.requestHandler) {
      this.channel.consume(this.requestQueue, async (msg) => {
      if (msg !== null) {
        const requestContent = msg.content.toString();
        const { correlationId, replyTo } = msg.properties;
        console.log(`[WorkerService] Received request: ${requestContent} with correlationId: ${correlationId}`);

        let responseData: any;
        try {
          // Simulate processing the request
          const parsedRequest = JSON.parse(requestContent);
          console.log(`[WorkerService] Processed request: ${parsedRequest}`);
          responseData = await this.requestHandler(parsedRequest, msg, channel);
        } catch (error) {
          console.error(`[WorkerService] Error processing request: ${error.message}`);
          responseData = { error: 'Failed to process request' };
        }

        if (replyTo) {
          this.channel.sendToQueue(
            replyTo,
            Buffer.from(JSON.stringify(responseData)),
            { correlationId: correlationId }
          );
          console.log(`[WorkerService] Sent response to ${replyTo} with correlationId: ${correlationId}`);
        } else {
          console.warn(`[WorkerService] No replyTo queue specified for request: ${requestContent}`);
          }

          this.channel.ack(msg);
        }
      }, { noAck: false });
    } else {
      console.warn('[WorkerService] No request handler set. Worker will not process RPC requests.');
    }
  }
}
