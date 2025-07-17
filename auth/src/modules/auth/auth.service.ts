import { Client } from '@/modules/clients/clients.interface';
import { ClientsService } from '@/modules/clients/clients.service';
import { UserService } from '@/modules/users/users.service'; // Injects the user service
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private clientsService: ClientsService,
    private jwtService: JwtService, // Injected to sign tokens
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username, pass); // Pass plaintext password to service
    if (user) {
      // user object returned by findOne already has password removed
      return user;
    }
    return null;
  }

  // 5. JWT Payload Definition: What data is put into the token
  async login(user: any) {
    // This payload is what will be encoded in the JWT and decoded by the Resource Server
    const payload = { username: user.username, sub: user.userId, roles: user.roles || ['user'] };
    return {
      access_token: this.jwtService.sign(payload), // Uses the configuration from JwtModule
    };
  }

  async register(username: string, password: string): Promise<any> {
    try {
        const newUser = await this.usersService.create(username, password); // Service handles hashing
        return this.login(newUser);
    } catch (error) {
        if (error.message.includes('User with this username already exists.')) {
            throw new UnauthorizedException('Username already exists.');
        }
        throw new UnauthorizedException('Registration failed.');
    }
  }

  async validateClientCredentials(clientId: string, clientSecret: string): Promise<Client | undefined> {
    const client = await this.clientsService.validateClientCredentials(clientId, clientSecret);
    if (!client) {
      throw new UnauthorizedException('Invalid client credentials');
    }
    // Check if client is allowed to use 'client_credentials' grant
    if (!client.allowedGrantTypes.includes('client_credentials')) {
      throw new UnauthorizedException('Client not authorized for client_credentials grant type');
    }
    return client;
  }

  async issueClientAccessToken(client: Client): Promise<{ access_token: string }> {
    // The payload for a client token should reflect the client's identity
    const payload = {
      sub: client.clientId, // Subject is the client ID
      client_id: client.clientId,
      // You might add client-specific roles or scopes here
      scope: 'client_access', // Example scope
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}