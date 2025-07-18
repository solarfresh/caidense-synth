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
}