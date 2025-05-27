import { Injectable } from '@nestjs/common';


@Injectable()
export class WorkerService {
  getHealthStatus(): { status: string; timestamp: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}