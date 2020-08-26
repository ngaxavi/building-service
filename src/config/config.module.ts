import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(): DynamicModule {
    const configService = new ConfigService();
    const configProviders = [
      {
        provide: 'CONFIG',
        useValue: configService.getConfig(),
      },
      {
        provide: ConfigService,
        useValue: configService,
      },
    ];
    return {
      module: ConfigModule,
      providers: configProviders,
      exports: configProviders,
    };
  }
}
