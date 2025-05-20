import { Controller, Post, Body } from '@nestjs/common';
import { ExecutionProducer } from './execution.producer';

@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionProducer: ExecutionProducer) {}

  @Post('send')
  async sendMessage(@Body('message') message: string) {
    if (!message) {
      return { status: 'error', message: 'Message content is required.' };
    }
    try {
      const result = await this.executionProducer.sendMessage(message);
      return { status: 'success', message: 'Message sent to RabbitMQ.', data: result };
    } catch (error) {
      return { status: 'error', message: 'Failed to send message to RabbitMQ.', error: error.message };
    }
  }
}