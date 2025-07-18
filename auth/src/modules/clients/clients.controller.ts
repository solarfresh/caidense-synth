import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { Client } from './clients.interface';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  // ⚠️ This is a simplified registration. In a real system, this endpoint
  // would typically be protected (e.g., by an admin API key or specific user roles)
  // or implement the OIDC Dynamic Client Registration Protocol.
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new client' }) // Describe the operation
  @ApiResponse({ status: 201, description: 'Client successfully registered.' }) // Describe successful response
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' }) // Describe error response
  @ApiBody({ type: CreateClientDto }) // Specify the DTO for request body
  @ApiTags('Clients') // Group under "Clients" in Swagger UI
  @ApiParam({ name: 'name', description: 'The name of the client.' }) // Describe the name parameter
  @ApiParam({ name: 'allowedGrantTypes', description: 'The allowed grant types for the client.' }) // Describe the allowedGrantTypes parameter
  async registerClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
    if (!createClientDto.name || !createClientDto.allowedGrantTypes || createClientDto.allowedGrantTypes.length === 0) {
      throw new UnauthorizedException('Name and at least one allowed grant type are required.');
    }
    // In a real scenario, validate allowedGrantTypes against a known list.
    const newClient = await this.clientsService.createClient(createClientDto.name, createClientDto.allowedGrantTypes);
    return newClient;
  }
}