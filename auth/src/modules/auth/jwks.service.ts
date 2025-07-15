import { AppConfigService } from '@/config/config.service';
import { SecretsService } from '@/secrets/secrets.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { exportJWK, importSPKI } from 'jose'; // Import necessary functions from 'jose'


@Injectable()
export class JwksService implements OnModuleInit {
  private readonly logger = new Logger(JwksService.name);
  private jwks: any = null; // Cache the generated JWKS

  // ⚠️ IMPORTANT: This 'kid' (Key ID) MUST MATCH the 'kid' used by your AuthModule's
  // JwtService when it signs the tokens with the private key.
  // If you don't explicitly set a 'kid' in your JwtModule.registerAsync's signOptions,
  // 'jose' (or 'jsonwebtoken') might auto-generate one. For consistency, it's best
  // to explicitly define it during key generation or in your JWT configuration.
  private readonly AUTH_SERVER_KEY_ID = process.env.AUTH_SERVER_KEY_ID || 'my-auth-key-id';

  constructor(
    private appConfigService: AppConfigService,
    private secretsService: SecretsService,
  ) {}

  /**
   * NestJS lifecycle hook. Called once the module has been initialized.
   * We use this to generate the JWKS upon application startup.
   */
  async onModuleInit() {
    await this.generateJwks();
  }

  /**
   * Generates the JSON Web Key Set (JWKS) from the public key.
   * This method fetches the public key from the SecretsService and converts it to JWK format.
   */
  private async generateJwks() {
    const jwtConfig = this.appConfigService.getJwtConfig();

    // JWKS is primarily for asymmetric keys (RSA, EC). If using symmetric, it's generally not applicable.
    if (!jwtConfig.useAsymmetric) {
      this.logger.warn(
        'JWKS endpoint requested, but symmetric keys (HS256) are in use. JWKS is primarily for asymmetric keys. Empty JWKS returned.',
      );
      this.jwks = { keys: [] };
      return;
    }

    try {
      // 1. Fetch the public key (PEM string) from the SecretsService
      const publicKeyPem = await this.secretsService.getSecret(jwtConfig.publicKeyId);
      if (!publicKeyPem) {
        throw new Error('Public key content is empty.');
      }

      // 2. Import the PEM public key string into a 'jose' cryptographic key object
      const publicKey = await importSPKI(publicKeyPem, 'RS256'); // Assuming RS256 algorithm

      // 3. Export the 'jose' key object into JWK format
      const jwk = await exportJWK(publicKey);

      // 4. Construct the full JWKS object
      // Add 'kid', 'alg', and 'use' properties as required for JWKS specification.
      this.jwks = {
        keys: [
          {
            ...jwk,
            kid: this.AUTH_SERVER_KEY_ID, // Use the consistent Key ID
            alg: 'RS256', // The algorithm used for signing tokens with this key
            use: 'sig',   // Indicates the key is used for digital signatures
          },
        ],
      };
      this.logger.log(`JWKS successfully generated for key ID: ${this.AUTH_SERVER_KEY_ID}`);
    } catch (error) {
      this.logger.error(`Failed to generate JWKS: ${error.message}`, error.stack);
      // In case of failure, return an empty JWKS or throw an error based on your policy.
      this.jwks = { keys: [] };
      throw new Error('Failed to generate JWKS.'); // Propagate error if JWKS is critical
    }
  }

  /**
   * Returns the cached JWKS.
   * Resource Servers will call this endpoint to get the public keys for JWT verification.
   */
  async getJwks(): Promise<any> {
    // If JWKS hasn't been generated yet (e.g., during rapid startup or previous failure), try again.
    if (!this.jwks || this.jwks.keys.length === 0) {
      this.logger.warn('JWKS not found in cache. Attempting to regenerate...');
      await this.generateJwks(); // Attempt to regenerate if not already done
    }
    return this.jwks;
  }
}