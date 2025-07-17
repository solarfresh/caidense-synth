import { BadRequestException, Body, Controller, Get, Post, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { OAuthTokenDto } from './dto/oauth-token.dto';
import { UserLoginDto } from './dto/users.login.dto';
import { UserRegisterDto } from './dto/users.register.dto';
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
  @ApiOperation({ summary: 'User login' }) // Describe the operation
  @ApiResponse({ status: 200, description: 'User successfully logged in and access token issued.' }) // Describe successful response
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials.' }) // Describe error response
  @ApiBody({ type: UserLoginDto }) // Specify the DTO for request body
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Validate incoming data
  @ApiTags('Authentication') // Group under "Authentication" in Swagger UI
  async login(@Body() req) {
    // This assumes req.username and req.password are in the request body.
    // For an AI agent, this might be agentId and secret.
    const user = await this.authService.validateUser(req.username, req.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Describe the operation
  @ApiResponse({ status: 201, description: 'User successfully registered and logged in.' }) // Describe successful response
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' }) // Describe error response
  @ApiBody({ type: UserRegisterDto })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Validate incoming data
  @ApiTags('Authentication') // Group under "Authentication" in Swagger UI
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

  @Post('oauth/token')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'OAuth Token Endpoint' }) // Describe the operation
  @ApiResponse({ status: 200, description: 'Access token issued successfully.' }) // Describe successful response
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' }) // Describe error response
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials.' }) // Describe error response
  @ApiBody({ type: OAuthTokenDto }) // Specify the DTO for request body
  @ApiTags('Authentication') // Group under "Authentication" in Swagger UI
  async getToken(@Body() oauthTokenDto: OAuthTokenDto) {
    const { grant_type, client_id, client_secret, username, password } = oauthTokenDto;

    switch (grant_type) {
      case 'client_credentials':
        if (!client_id || !client_secret) {
          throw new BadRequestException('client_id and client_secret are required for client_credentials grant_type.');
        }
        const client = await this.authService.validateClientCredentials(client_id, client_secret);
        if (!client) {
          throw new UnauthorizedException('Invalid client credentials.');
        }
        return this.authService.issueClientAccessToken(client);

      case 'password': // Password Grant (for users, generally deprecated for SPAs/mobile)
        if (!username || !password) {
          throw new BadRequestException('username and password are required for password grant_type.');
        }
        const user = await this.authService.validateUser(username, password);
        if (!user) {
          throw new UnauthorizedException('Invalid user credentials.');
        }
        return this.authService.login(user);

      // ⚠️ You would add more cases here for other grant types like 'authorization_code', 'refresh_token', etc.
      // Each would have its own validation and token issuance logic.
      default:
        throw new BadRequestException(`Unsupported grant_type: ${grant_type}`);
    }
  }
}