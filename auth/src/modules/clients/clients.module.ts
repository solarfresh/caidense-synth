import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientDocument, ClientSchema } from './client.schemas';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: ClientDocument.name, schema: ClientSchema }]),
  ],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [ClientsService], // Export so AuthService can use it
})
export class ClientsModule {}