import { GraphService } from '@caidense/reasoning/graph/graph.service';
import { ExecutionConfig, ExecutionRequestHandler } from '@caidense/reasoning/message/message.interface';
import { BaseRabbitMQService } from '@caidense/reasoning/message/message.service';
import { ReasoningThinkingDto } from '@caidense/reasoning/thinking/dto/thinking.dto';
import { ReasoningThinkingService } from '@caidense/reasoning/thinking/thinking.service';
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';


@Injectable()
export class ExecutionConsumer extends BaseRabbitMQService {
  private readonly requestQueue: string;
  private readonly graphService: GraphService;
  private readonly reasoningThinkingService: ReasoningThinkingService;

  constructor(
    config: ExecutionConfig,
    graphService: GraphService,
    reasoningThinkingService: ReasoningThinkingService
  ) {
    super(config);
    this.requestQueue = config.requestQueue;
    this.graphService = graphService;
    this.reasoningThinkingService = reasoningThinkingService;
  }

  private requestHandler: ExecutionRequestHandler<any, any> = async (thinkingId, msg, channel) => {
    /**
     * Handles the execution of the thinking process.
     * @param thinkingId - The ID of the thinking process to be executed.
     * @param msg - The message containing the request details.
     * @param channel - The RabbitMQ channel for communication.
     * @returns The result of the thinking process execution.
     */

    /**
     * Obtain the thinking graph from the database using the thinkingId.
     */
    const graphInstance = await this.reasoningThinkingService.findById(thinkingId);
    const graph = new ReasoningThinkingDto(graphInstance);
    return await this.graphService.runGraph(graph);
  };

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
