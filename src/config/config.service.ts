import { AuthConfig, Config, KafkaConfig, MongoConfig } from './config.interface';
import { v4 as uuid } from 'uuid';

export class ConfigService {
  private config: Config;

  constructor() {
    const authDefault = {
      algorithms: ['RS256'],
      issuer: 'https://keycloak.ngaxavilabs.com/auth/realms/devops',
      publicKey:
        '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAh6UwXpi4Io7gx0amwCVy/z1jGgw1jiGT8Hxgbspvt7nZ7PtRmXxJXnFfQOMuTYDEj0PoSr258NofSeHt9vQkxMGVNbwrMetLMbo9nn45MioZzDEu29QfmkpIXaAbJxBVy1Zw8JTqe1rTYbSnqDeutVzEt07W08oQw6yk5icXnh189oxo1QDf4jZYZVQHQ9yGNpGG7lsSeszQZlMxpuz8cL2mo0qhyGea41f/HJ99UdSL7whBW8jCPxaUznSS4zHYnF/XaA4xx2v8T4T05U8DKMeIQZW5xJnGis7Q9QB4pCAcWJnJxix3C6R+YvNlIXwvqbBSFumtc/oO+weYFD7euQIDAQAB\n-----END PUBLIC KEY-----',
      realm: 'devops',
      resource: 'building-service',
      secret: '',
    };

    const auth: AuthConfig = {
      algorithms: authDefault.algorithms || ['RS256'],
      issuer: process.env.AUTH_ISSUER || authDefault.issuer,
      publicKey: process.env.AUTH_PUBLIC_KEY || authDefault.publicKey,
      realm: process.env.AUTH_REALM || authDefault.realm,
      resource: process.env.AUTH_RESOURCE || authDefault.resource || 'building-service',
      secret: process.env.AUTH_SECRET || authDefault.secret,
    };

    const kafka: KafkaConfig = {
      clientId: 'building',
      prefix: process.env.KAFKA_PREFIX || 'local',
    };

    const kafkaHost = process.env.KAFKA_HOST || 'localhost';
    const kafkaPort = process.env.KAFKA_PORT || '9093';

    kafka.brokerUris = [`${kafkaHost}:${kafkaPort}`];

    const mongo: MongoConfig = {
      uri: process.env.MONGO_URI || '',
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const user = process.env.MONGO_USER || '';
    const password = process.env.MONGO_PASSWORD || '';
    const credentials = user && password ? `${user}:${password}@` : '';
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || '27017';
    const database = process.env.MONGO_DB || 'building';
    mongo.uri = process.env.MONGO_URI || `mongodb://${credentials}${host}:${port}/${database}`;

    this.config = {
      id: uuid(),
      name: 'building-service',
      port: +process.env.PORT || 3000,
      prefix: process.env.PREFIX || 'api',
      env: process.env.NODE_ENV || 'development',
      auth,
      kafka,
      mongo,
    };
  }

  public getConfig(): Config {
    return this.config;
  }

  public getAuth(): AuthConfig {
    return this.config.auth;
  }

  public getMongo(): MongoConfig {
    return this.config.mongo;
  }

  public getPort(): number {
    return this.config.port;
  }

  public getPrefix(): string {
    return this.config.prefix;
  }

  public getKafka(): KafkaConfig {
    return this.config.kafka;
  }
}
