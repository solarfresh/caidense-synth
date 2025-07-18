import { AppConfigService } from '@/config/config.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private appConfigService: AppConfigService,
  ) {
    const authServerUrl = appConfigService.get('AUTH_SERVER_URL');
    const jwksUri = `${authServerUrl}/auth/.well-known/jwks.json`;

    const jwksRsaProvider = jwksRsa.passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: jwksUri,
      handleSigningKeyError: (err, cb) => {
        this.logger.error(`jwks-rsa Signing Key Error: ${err.message}`);
        if (err.name === 'SigningKeyNotFoundError') {
          return cb(new UnauthorizedException('Signing key not found.'));
        }
        return cb(err);
      },
    });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      ignoreExpiration: false, // Do not ignore token expiration
      // Provide the secret/public key dynamically using a callback.
      // This callback is called by passport-jwt to get the key for verification.
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        this.logger.log('secretOrKeyProvider called.');
        this.logger.debug(`Raw JWT: ${rawJwtToken ? rawJwtToken.substring(0, 30) + '...' : 'none'}`);
        jwksRsaProvider(request, rawJwtToken, done);
      },
      // Optional: Validate issuer and audience for more robust security
      // issuer: appConfigService.getJwtIssuer(),
      // audience: appConfigService.getJwtAudience(),
    });

    this.logger.log(`JWT Strategy initialized with JWKS URI: ${jwksUri}`);
  }

  // This method is called after the JWT is successfully verified.
  // The 'payload' is the decoded JWT payload.
  async validate(payload: JwtPayload) {
    this.logger.log(`JwtStrategy validate called with payload: ${JSON.stringify(payload)}`);
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid JWT payload: Missing subject (sub).');
    }

    if (payload.username && payload.roles) {
      // This looks like a user token
      return { userId: payload.sub, username: payload.username, roles: payload.roles };
    } else if (payload.client_id && payload.scope) {
      // This looks like a client (machine-to-machine) token
      // You might parse 'scope' string into an array if needed
      const scopesArray = Array.isArray(payload.scope) ? payload.scope : (typeof payload.scope === 'string' ? payload.scope.split(' ') : []);
      return { clientId: payload.sub, scopes: scopesArray, isClient: true }; // Add a flag for easy check
    } else {
      // Token structure not recognized for either user or client
      this.logger.warn(`JWT payload structure not recognized: ${JSON.stringify(payload)}`);
      throw new UnauthorizedException('Unrecognized JWT payload structure.');
    }
  }
}