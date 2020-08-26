import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from '@building/auth';
import { LoggerMiddleware, LoggerModule } from '@building/logger';
import { ConfigModule, ConfigService } from '@building/config';
import { JwtModule } from '@nestjs/jwt';
import { KafkaModule } from '@building/kafka';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildingModule } from './building/building.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.getAuth(),
    }),
    KafkaModule.forRootAsync(),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService.getMongo(),
      inject: [ConfigService],
    }),
    BuildingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
