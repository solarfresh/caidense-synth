import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwksFetcherService } from './jwks-fetcher.service'; // Import JWKS fetcher
import { AppConfigService } from '@/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private jwksFetcherService: JwksFetcherService, // Inject JWKS fetcher
    private appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      ignoreExpiration: false, // Do not ignore token expiration
      // Provide the secret/public key dynamically using a callback.
      // This callback is called by passport-jwt to get the key for verification.
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          // This uses jose's createRemoteJWKSet which handles fetching and key selection by 'kid'.
          const jwksSet = this.jwksFetcherService.getJwksSet();
          const { header } = await jwksSet.getJwk(rawJwtToken); // Get the JWK header to find the kid
          const key = await jwksSet.getJwk(header.kid); // Get the specific key by kid from the JWKS
          done(null, key); // Pass the key to passport-jwt for verification
        } catch (error) {
          this.logger.error('Error fetching/providing JWT key:', error.message);
          done(error, false); // Indicate failure
        }
      },
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
        throw new UnauthorizedException('Invalid JWT payload.');
    }
    // passport-jwt will attach whatever is returned here to `req.user`
    return { userId: payload.sub, username: payload.username, roles: payload.roles };
  }
}