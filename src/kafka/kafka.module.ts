import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@building/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Global()
@Module({})
export class KafkaModule {
  static forRootAsync(): DynamicModule {
    const kafkaProvider = {
      provide: 'KAFKA_SERVICE',
      useFactory: async (configService: ConfigService): Promise<ClientProxy> => {
        const kafkaConfig = configService.getKafka();
        const clientProxy = ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: kafkaConfig.clientId,
              brokers: kafkaConfig.brokerUris,
            },
            consumer: {
              groupId: `${kafkaConfig.prefix}-${kafkaConfig.clientId}-consumer`
            }
          }
        });
        await clientProxy.connect();
        return clientProxy;
      },
      inject: [ConfigService],
    };

    return {
      module: KafkaModule,
      providers: [kafkaProvider],
      exports: [kafkaProvider]
    };
  }
}
