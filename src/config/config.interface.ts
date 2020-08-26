export interface KeycloakAuthConfig {
  algorithms: string[];
  issuer: string;
  publicKey: string;
  realm: string;
  resource: string;
  secret?: string;
}

export type AuthConfig = KeycloakAuthConfig;

export interface MongoConfig {
  uri: string;
  useCreateIndex?: boolean;
  useFindAndModify?: boolean;
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
}

export interface Config {
  id: string;
  env: string;
  name: string;
  prefix: string;
  port: number;
  auth: AuthConfig;
  kafka: KafkaConfig;
  mongo: MongoConfig;
}

export interface KafkaConfig {
  clientId: string;
  prefix?: string;
  brokerUris?: string[];
}
