import { Controller, Post, Body, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwksService } from './jwks.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwksService: JwksService, // Inject the JwksService
  ) {}

  /**
   * Endpoint for user/agent login.
   * Authenticates credentials and returns an access token.
   */
  @Post('login')
  async login(@Body() req) {
    // This assumes req.username and req.password are in the request body.
    // For an AI agent, this might be agentId and secret.
    const user = await this.authService.validateUser(req.username, req.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    return this.authService.login(user);
  }

  /**
   * Endpoint for user/agent registration.
   * Creates a new user/agent and returns an access token.
   */
  @Post('register')
  async register(@Body() req) {
    // This assumes req.username and req.password for registration.
    return this.authService.register(req.username, req.password);
  }

  /**
   * Endpoint to expose the JSON Web Key Set (JWKS).
   * Resource Servers will use this to retrieve the Auth Server's public keys
   * for verifying JWT signatures.
   */
  @Get('.well-known/jwks.json') // Standard path for JWKS endpoint
  async getJwks() {
    // The JwksService is responsible for providing the JWKS data.
    // In a real app, it would use the public key(s) managed by the SecretsService.
    return this.jwksService.getJwks();
  }
}