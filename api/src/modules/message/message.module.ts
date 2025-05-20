import { Module } from '@nestjs/common';
import { MessageConsumer } from './message.consumer';
import { MessageProducer } from './message.producer';
import { MessageController } from './message.controller';


@Module({
  providers: [MessageConsumer, MessageProducer],
  controllers: [MessageController],
  exports: [MessageProducer],
})
export class MessageModule {}