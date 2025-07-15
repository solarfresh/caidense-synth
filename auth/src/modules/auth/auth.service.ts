import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../users/users.service'; // Injects the user service


@Injectable()
export class AuthService {
  constructor(
    // private usersService: UserService,
    private jwtService: JwtService, // Injected to sign tokens
  ) {}

  // 4. User Validation Logic: How the Auth Server verifies credentials
  async validateUser(username: string, pass: string): Promise<any> {
    // const user = await this.usersService.findOne(username);
    // if (user && user.password === pass) { // WARNING: Use bcrypt.compare() in real apps
    //   const { password, ...result } = user; // Exclude password from the returned object
    //   return result;
    // }
    return null;
  }

  // 5. JWT Payload Definition: What data is put into the token
  async login(user: any) {
    // This payload is what will be encoded in the JWT and decoded by the Resource Server
    const payload = { username: user.username, sub: user.userId, roles: user.roles || ['user'] };
    return {
      access_token: this.jwtService.sign(payload), // Uses the configuration from JwtModule
    };
  }

  async register(username: string, password: string): Promise<any> {
    // In a real app, hash password before saving
    // const newUser = await this.usersService.create(username, password);
    // Optionally log in the user immediately after registration
    // return this.login(newUser);
    return null;
  }
}