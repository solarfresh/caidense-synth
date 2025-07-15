import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get<T>(key: string): T {
    const value = this.configService.get<T>(key);
    if (value === undefined) {
      throw new Error(`Configuration key "${key}" is not set.`);
    }
    return value;
  }

  getSecretSource(): 'file' | 'kubernetes' | 'aws' | 'gcp' | 'vault' { // <-- NEW
    return this.get<any>('SECRET_SOURCE');
  }

  getJwtConfig() {
    const useAsymmetric = this.get<boolean>('USE_ASYMMETRIC_KEYS');
    const expiresIn = this.get<string>('JWT_ACCESS_TOKEN_EXPIRATION');

    if (useAsymmetric) {
      return {
        useAsymmetric,
        privateKeyId: this.get<string>('JWT_PRIVATE_KEY_ID'),
        publicKeyId: this.get<string>('JWT_PUBLIC_KEY_ID'),
        expiresIn,
      };
    } else {
      return {
        useAsymmetric,
        secret: this.get<string>('JWT_SECRET'),
        expiresIn,
      };
    }
  }
}