import { Inject, LoggerService as BaseLoggerService } from '@nestjs/common';
import { inspect } from 'util';
import { Logger, createLogger, format, transports } from 'winston';
import { Config } from '@building/config';
import { ClientKafka } from '@nestjs/microservices';

const consoleFormat = format.combine(
  format.json(),
  format.timestamp({ format: 'HH:mm:ss.SSS' }),
  format.colorize(),
  format.printf(info => {
    const msg = typeof info.message === 'object' ? inspect(info.message, { depth: 4 }) : info.message;
    return `[${info.level}] ${info.timestamp}   ${msg}`;
  }),
);

export class LoggerService implements BaseLoggerService {
  private readonly logger: Logger;

  constructor(
    @Inject('CONFIG') private config: Config,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    const env = process.env.NODE_ENV || 'development';
    const level = process.env.LOG_LEVEL || 'debug';

    if (env === 'production') {
      this.logger = createLogger({
        transports: [new transports.Console({ format: consoleFormat, level, stderrLevels: [] })],
      });
    } else if (env === 'test') {
      this.logger = createLogger({
        transports: [new transports.Console({ format: consoleFormat, level: 'warn', stderrLevels: [] })],
      });
    } else {
      this.logger = createLogger({
        transports: [new transports.Console({ format: consoleFormat, level, stderrLevels: [] })],
      });
    }
  }

  verbose(message: string, metadata?: unknown): void {
    this.logger.verbose(message, metadata);
  }

  debug(message: string, metadata?: unknown): void {
    this.logger.debug(message, metadata);
  }

  log(message: string, metadata?: unknown): void {
    this.logger.info(message, metadata);
  }

  warn(message: string, metadata?: unknown): void {
    this.logger.warn(message, metadata);
    this.logOnKafka(message);
  }

  error(error: Error | string, metadata?: unknown): void {
    if (error instanceof Error) {
      this.logger.error(`${error.message}\n${error.stack}`, metadata);
      this.logOnKafka(error.message);
    } else {
      this.logger.error(error, metadata);
      this.logOnKafka(error);
    }
  }

  private logOnKafka(message: string) {
    const kafka = this.config.kafka;
    this.kafkaClient.emit(`${kafka.prefix}-${kafka.clientId}-log`, message);
  }
}
