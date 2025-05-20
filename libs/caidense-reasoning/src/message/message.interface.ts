import * as amqp from 'amqplib';


export enum ExchangeType {
  DIRECT = 'direct',
  TOPIC = 'topic',
  FANOUT = 'fanout',
  HEADERS = 'headers',
}

export interface RabbitMQConfig {
  url: string;
  exchangeName?: string;
  exchangeType?: ExchangeType;
  queueName?: string;
  prefetchCount?: number;
}

export interface ExecutionConfig extends RabbitMQConfig {
  requestQueue: string;
  replyTimeoutMs?: number;
}

export type ExecutionRequestHandler<TRequest, TResponse> = (
  request: TRequest,
  rawMsg: amqp.ConsumeMessage,
  channel: amqp.Channel,
) => Promise<TResponse>;