import { AppConfigModule } from '@/config/config.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwksFetcherService } from './jwks-fetcher.service'; // Import JWKS fetcher
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    AppConfigModule,
    JwtModule.register({
      // We don't provide a 'secret' or 'privateKey' here directly,
      // as the public key for verification will be fetched dynamically via JwtStrategy.
      // However, JwtModule still requires a minimal config to initialize.
      // This 'secret' can be a dummy value if the strategy handles the key.
      secret: 'THIS_IS_A_DUMMY_SECRET_AND_SHOULD_BE_OVERRIDDEN_BY_STRATEGY',
      signOptions: { expiresIn: '1h' }, // Not strictly needed for verification only, but common
    }),
  ],
  providers: [
    JwksFetcherService, // Provide the JWKS fetcher
    JwtStrategy,        // Provide the JWT verification strategy
  ],
  exports: [
    JwtModule,          // Export JwtModule for other modules if they need JwtService
    JwtStrategy,        // Export strategy for guards
  ],
})
export class AuthModule {}