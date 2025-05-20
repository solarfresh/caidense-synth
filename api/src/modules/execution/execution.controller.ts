import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExecutionProducer } from './execution.producer';


@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionProducer: ExecutionProducer) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a message to RabbitMQ' })
  @ApiResponse({ status: 200, description: 'Message sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({
    description: 'Message content to be sent to RabbitMQ',
    type: String,
  })
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