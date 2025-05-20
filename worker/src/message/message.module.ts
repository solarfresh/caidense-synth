import { Module } from '@nestjs/common';
import { MessageConsumer } from './message.consumer';
import { MessageProducer } from './message.producer';


@Module({
  providers: [MessageConsumer, MessageProducer],
  controllers: [],
  exports: [MessageProducer],
})
export class MessageModule {}