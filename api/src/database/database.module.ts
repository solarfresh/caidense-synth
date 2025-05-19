import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
imports: [
    MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        // 其他 Mongoose 連線選項
    }),
    inject: [ConfigService],
    }),
],
exports: [MongooseModule], // 將 MongooseModule 導出，供其他模組使用
})
export class DatabaseModule {}