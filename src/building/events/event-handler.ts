import { Event } from './event';
import { RpcException } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { UpdateFlatDto } from '../dto';
import { CreatedDeviceEvent } from './created-device.event';
import { BuildingService } from '../building.service';
import { Flat } from '../building.schema';
import { FlatOccupiedEvent } from './flat-occupied.event';

@Injectable()
export class EventHandler {
  constructor(private readonly buildingService: BuildingService) {}

  async handleEvent(event: Event): Promise<Flat> {
    if (event.action === 'DeviceCreated') {
      return this.handleCreatedDeviceEvent(event as CreatedDeviceEvent);
    } else if (event.action === 'FlatOccupied') {
      return this.handleFlatOccupiedEvent(event as FlatOccupiedEvent);
    } else {
      throw new RpcException(`Unsupported event action: ${event.action}`);
    }
  }

  private async handleCreatedDeviceEvent(event: CreatedDeviceEvent): Promise<Flat> {
    const { flatId, devicesStatus, rooms } = event.data;
    return this.buildingService.updateFlat(flatId, { devicesStatus, rooms } as UpdateFlatDto);
  }

  private async handleFlatOccupiedEvent(event: FlatOccupiedEvent): Promise<Flat> {
    const { flatId, occupied } = event.data;
    return this.buildingService.updateFlat(flatId, { occupied } as UpdateFlatDto);
  }
}
