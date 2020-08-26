
import { ArgumentMetadata, BadRequestException as BaseBadRequestException } from '@nestjs/common';

export class BadRequestException extends BaseBadRequestException {
  constructor(metadata: ArgumentMetadata, reason: string) {
    let type = '';
    switch (metadata.type) {
      case 'param':
        type = 'Parameter';
        break;
      case 'query':
        type = 'Query String';
        break;
      case 'body':
        type = 'Body Parameter';
        break;
    }
    super(`${type} '${metadata.data}' ${reason}.`);
  }
}
