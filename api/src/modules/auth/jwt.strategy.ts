import { AppConfigService } from '@/config/config.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private appConfigService: AppConfigService,
  ) {
    const authServerUrl = appConfigService.get('AUTH_SERVER_URL');
    const jwksUri = `${authServerUrl}/auth/.well-known/jwks.json`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      ignoreExpiration: false, // Do not ignore token expiration
      // Provide the secret/public key dynamically using a callback.
      // This callback is called by passport-jwt to get the key for verification.
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,              // Cache the signing keys to prevent excessive network requests
        rateLimit: true,          // Prevent against too many requests from a single IP address
        jwksRequestsPerMinute: 5, // Allow 5 requests per minute to the JWKS endpoint
        jwksUri: jwksUri,         // The URL of your Auth Server's JWKS endpoint
      }),
      // Optional: Validate issuer and audience for more robust security
      // issuer: appConfigService.getJwtIssuer(),
      // audience: appConfigService.getJwtAudience(),
    });
  }

  // This method is called after the JWT is successfully verified.
  // The 'payload' is the decoded JWT payload.
  async validate(payload: any) {
    // You can perform additional validation here, e.g.,
    // 1. Check if the user ID (payload.sub) exists in your database.
    // 2. Check if the user is still active or authorized.
    // This example simply returns the payload.
    if (!payload || !payload.sub || !payload.username) {
        // throw new UnauthorizedException('Invalid JWT payload.');
        this.logger.warn('Invalid JWT payload.');

    }
    // passport-jwt will attach whatever is returned here to `req.user`
    return { userId: payload.sub, username: payload.username, roles: payload.roles };
  }
}