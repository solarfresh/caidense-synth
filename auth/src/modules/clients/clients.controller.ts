import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './clients.interface';

// DTO for client registration request
class CreateClientDto {
  name: string;
  allowedGrantTypes: string[];
}

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  // ⚠️ This is a simplified registration. In a real system, this endpoint
  // would typically be protected (e.g., by an admin API key or specific user roles)
  // or implement the OIDC Dynamic Client Registration Protocol.
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
    if (!createClientDto.name || !createClientDto.allowedGrantTypes || createClientDto.allowedGrantTypes.length === 0) {
      throw new UnauthorizedException('Name and at least one allowed grant type are required.');
    }
    // In a real scenario, validate allowedGrantTypes against a known list.
    const newClient = await this.clientsService.createClient(createClientDto.name, createClientDto.allowedGrantTypes);
    return newClient;
  }
}