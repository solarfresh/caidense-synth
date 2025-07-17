import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { UsersModule } from '../users/users.module';
import { AppConfigModule } from '@/config/config.module';
import { AppConfigService } from '@/config/config.service';
import { SecretsModule } from '@/secrets/secrets.module';
import { SecretsService } from '@/secrets/secrets.service';
import { JwksService } from './jwks.service';
import { ClientsService } from '@/modules/clients/clients.service';
import { ClientsModule } from '@/modules/clients/clients.module';


@Module({
  imports: [
    // UsersModule,
    ClientsModule,
    PassportModule,
    AppConfigModule, // Make app config available
    SecretsModule, // Make secrets service available
    JwtModule.registerAsync({ // Use registerAsync to inject services
      imports: [AppConfigModule, SecretsModule], // Declare dependencies
      useFactory: async (
        appConfigService: AppConfigService,
        secretsService: SecretsService, // Inject the SecretsService
      ) => {
        const jwtConfig = appConfigService.getJwtConfig(); // Get base JWT config

        if (jwtConfig.useAsymmetric) {
          // Fetch private and public keys using the SecretsService
          const privateKey = await secretsService.getSecret(jwtConfig.privateKeyId);
          const publicKey = await secretsService.getSecret(jwtConfig.publicKeyId); // Public key for verification on Resource Server side, often not needed here.

          return {
            privateKey: privateKey,
            publicKey: publicKey, // The public key can be passed if the Auth Server also self-verifies tokens, or for consistency.
            signOptions: {
              expiresIn: jwtConfig.expiresIn,
              algorithm: 'RS256',
            },
          };
        } else {
          // Fetch symmetric secret using the SecretsService
          const secret = await secretsService.getSecret(jwtConfig.secret); // Assuming 'secret' directly holds the env var name for demo
          return {
            secret: secret,
            signOptions: {
              expiresIn: jwtConfig.expiresIn,
              algorithm: 'HS256',
            },
          };
        }
      },
      inject: [AppConfigService, SecretsService], // Specify services to inject
    }),
  ],
  providers: [AuthService, JwksService],
  controllers: [AuthController],
  exports: [AuthService, JwksService, JwtModule],
})
export class AuthModule {}