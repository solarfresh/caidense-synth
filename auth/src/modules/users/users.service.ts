import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { UserDocument } from './users.schemas';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {};

  /**
   * Finds a user by username and validates their password.
   * Returns the user object (without password) if valid, otherwise undefined.
   */
  async findOne(username: string, plainPassword?: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ username, isActive: true }).exec();

    if (!user) {
      return undefined; // User not found
    }

    // If a plaintext password is provided, compare it with the stored hash
    if (plainPassword) {
      const isMatch = await bcrypt.compare(plainPassword, user.password);
      if (isMatch) {
        // Return a plain object without the hashed password
        const userObject = user.toObject();
        delete userObject.password;
        return userObject;
      }
      return undefined; // Password does not match
    }

    // If no plaintext password is provided (e.g., for internal lookup),
    // return the user object without the password.
    const userObject = user.toJSON();
    delete userObject.password;
    return userObject;
  }

  /**
   * Creates a new user with a hashed password.
   * Returns the newly created user object (without password).
   */
  async create(username: string, plainPassword: string): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
        throw new Error('User with this username already exists.'); // Or use a custom NestJS exception
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);

    const newUser = await this.userModel.create({
      username,
      password: hashedPassword,
      roles: ['user'], // Default role for newly registered users
      isActive: true,
    });

    this.logger.log(`User created: ${username}`);
    // Return a plain object without the hashed password
    const userObject = newUser.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Finds a user by their Mongoose _id. Useful when you have the 'sub' claim from JWT.
   */
  async findById(id: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findById(id).exec();
    if (!user || !user.isActive) {
        return undefined;
    }
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }
}