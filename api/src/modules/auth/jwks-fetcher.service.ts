import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AppConfigService } from '@/config/config.service';
import { createRemoteJWKSet, jwtVerify, importJWK } from 'jose'; // npm install jose


@Injectable()
export class JwksFetcherService implements OnModuleInit {
  private readonly logger = new Logger(JwksFetcherService.name);
  private jwksSet: ReturnType<typeof createRemoteJWKSet>;

  constructor(private appConfigService: AppConfigService) {}

  async onModuleInit() {
    const authServerUrl = this.appConfigService.get('AUTH_SERVER_URL');
    const jwksUrl = `${authServerUrl}/auth/.well-known/jwks.json`; // Standard JWKS endpoint
    this.logger.log(`Initializing JWKS fetcher for: ${jwksUrl}`);

    // createRemoteJWKSet handles fetching, caching, and rotating JWKS automatically.
    this.jwksSet = createRemoteJWKSet(new URL(jwksUrl), {
      // Optional: tune caching and refresh behavior
      // maxAge: 60 * 60 * 1000, // Cache keys for 1 hour
      // aggressive: true, // Attempt to refresh keys more frequently
    });

    this.logger.log('JWKS fetcher initialized.');
  }

  /**
   * Returns the JWKSet object, used by JwtStrategy for verification.
   * This object encapsulates the fetching and caching logic.
   */
  getJwksSet(): ReturnType<typeof createRemoteJWKSet> {
    if (!this.jwksSet) {
      // This case should ideally not happen if onModuleInit runs successfully
      this.logger.error('JWKSSet not initialized. This indicates a startup issue.');
      throw new Error('JWKSSet not initialized.');
    }
    return this.jwksSet;
  }

  /**
   * Optional: A method to manually verify a JWT if needed outside of Passport.js strategy.
   */
  async verifyJwt(token: string): Promise<any> {
    try {
      const { payload } = await jwtVerify(token, this.jwksSet, {
        // Optional: Specify expected issuer and audience for stronger validation
        // issuer: 'your-auth-server-issuer',
        // audience: 'your-resource-server-audience',
      });
      return payload;
    } catch (error) {
      this.logger.error('JWT verification failed:', error.message);
      throw error;
    }
  }
}