import { FlatOccupiedEvent } from './../building/events/flat-occupied.event';
import { Event } from '../building/events/event';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatedDeviceEvent } from '../building/events/created-device.event';

export const KafkaEvent = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<Event> => {
    const ctxData = ctx.switchToRpc().getData();
    const value = ctxData.value;
    if (!ctxData || !ctxData.value || !ctxData.topic || !value.type) {
      throw new RpcException('Invalid kafka event message');
    }

    let event: Event;

    if (value.action === 'DeviceCreated') {
      event = plainToClass(CreatedDeviceEvent, value);
    } else if (value.action === 'FlatOccupied') {
      event = plainToClass(FlatOccupiedEvent, value);
    } else {
      throw new RpcException(`Unknown event action: ${value.action}`);
    }

    // Validate
    const errors = await validate(event);
    if (errors.length > 0) {
      throw new RpcException(errors);
    }

    return event;
  },
);
