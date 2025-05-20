import { Controller, Post, Body } from '@nestjs/common';
import { MessageProducer } from './message.producer';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageProducer: MessageProducer) {}

  @Post('send')
  async sendMessage(@Body('message') message: string) {
    if (!message) {
      return { status: 'error', message: 'Message content is required.' };
    }
    await this.messageProducer.sendMessage(message);
    return { status: 'success', message: 'Message sent to RabbitMQ.' };
  }
}