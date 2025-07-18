import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './users.service';
import { UserDocument, UserSchema } from './users.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [UserService], // Export UserService to be used by AuthService
})
export class UsersModule {}