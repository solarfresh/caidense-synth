import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateExecutionDto } from './dto/create-execution.dto';
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
    type: CreateExecutionDto,
  })
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() createExecutionDto: CreateExecutionDto) {
    const thinkingId = createExecutionDto.thinkingId;
    if (!thinkingId) {
      return { status: 500, message: 'thinkingId content is required.' };
    }
    try {
      const result = await this.executionProducer.sendMessage(thinkingId);
      console.log('Message sent to RabbitMQ:', result);
      return { status: 200, message: 'Message sent to RabbitMQ.', data: result };
    } catch (error) {
      return { status: 500, message: 'Failed to send thinkingId to RabbitMQ.', error: error.message };
    }
  }
}