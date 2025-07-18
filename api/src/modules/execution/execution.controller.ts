import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateExecutionDto } from './dto/create-execution.dto';
import { ExecutionProducer } from './execution.producer';


@ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Body() createExecutionDto: CreateExecutionDto) {
    try {
      const result = await this.executionProducer.sendMessage(createExecutionDto);
      return { status: 200, message: 'Message response from Worker Service.', data: result };
    } catch (error) {
      return { status: 500, message: 'Failed to send a message to RabbitMQ.', error: error.message };
    }
  }
}