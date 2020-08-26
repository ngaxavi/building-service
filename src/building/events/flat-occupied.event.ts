import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Event } from './event';

class FlatDeviceStatus {
  @IsNotEmpty()
  @IsString()
  readonly flatId: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly occupied: boolean;
}

export class FlatOccupiedEvent extends Event {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FlatDeviceStatus)
  readonly data: FlatDeviceStatus;
}
