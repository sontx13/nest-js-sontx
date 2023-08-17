import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  //MongooseModule.forRoot('mongodb+srv://sontx13:Sonphuong1710@cluster0.bp5irmg.mongodb.net/?retryWrites=true&w=majority')
  imports: [MongooseModule.forRootAsync({
              imports: [ConfigModule],
              useFactory:async (configService:ConfigService) => ({
                uri: configService.get<string>('MONGO_URL'),
              }),
              inject:[ConfigService]
            }),
            ConfigModule.forRoot({
              isGlobal:true
            }),
            UsersModule,
            AuthModule  
            ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
