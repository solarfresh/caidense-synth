import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ClientDocument } from './clients.schemas';


@Injectable()
export class ClientsService implements OnModuleInit {
  private readonly logger = new Logger(ClientsService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectModel(ClientDocument.name) private clientModel: Model<ClientDocument>,
  ) {}

  async onModuleInit() {};

  async createClient(name: string, allowedGrantTypes: string[]): Promise<ClientDocument> {
    const clientId = uuidv4();
    const plainTextSecret = uuidv4();
    const hashedSecret = await bcrypt.hash(plainTextSecret, this.SALT_ROUNDS);

    const newClientData  = {
      clientId,
      clientSecret: hashedSecret,
      name,
      allowedGrantTypes,
    };

    const createdClient = await this.clientModel.create(newClientData);
    this.logger.log(`New client registered: ${name} (${clientId})`);

    return { ...createdClient.toJSON(), clientSecret: plainTextSecret };
  }

  async findClientById(clientId: string): Promise<ClientDocument | undefined> {
    return this.clientModel.findOne({ clientId }).exec();
  }

  async validateClientCredentials(clientId: string, clientSecret: string): Promise<ClientDocument | undefined> {
    const client = await this.findClientById(clientId);
    if (client && client.isActive) { // Check if client exists and is active
      const isMatch = await bcrypt.compare(clientSecret, client.clientSecret);
      if (isMatch) {
        return client;
      }
    }
    return undefined;
  }
}