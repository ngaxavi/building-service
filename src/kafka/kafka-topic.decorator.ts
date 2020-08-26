import { ConfigService } from '@building/config';
import { PATTERN_HANDLER_METADATA, PATTERN_METADATA, TRANSPORT_METADATA } from '@nestjs/microservices/constants';
import { Transport } from '@nestjs/microservices';

export const KafkaTopic = (metadata?: string): MethodDecorator => {
  return (target: unknown, key: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const configService: ConfigService = new ConfigService();
    const kafkaConfig = configService.getKafka();

    Reflect.defineMetadata(PATTERN_METADATA, `${kafkaConfig.prefix}-${metadata}`, descriptor.value);
    Reflect.defineMetadata(PATTERN_HANDLER_METADATA, 2, descriptor.value);
    Reflect.defineMetadata(TRANSPORT_METADATA, Transport.KAFKA, descriptor.value);

    return descriptor;
  };
};
