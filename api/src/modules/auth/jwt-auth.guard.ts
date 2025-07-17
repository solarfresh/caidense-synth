import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // You can extend this guard with custom logic,
  // e.g., handling specific errors or logging.
}