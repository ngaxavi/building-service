import { IsIn, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Event } from './event';


class FlatDeviceStatus {
  @IsNotEmpty()
  @IsString()
  readonly flatId: string

  @IsNotEmpty()
  @IsInt({each: true})
  readonly rooms: number[];

  @IsNotEmpty()
  @IsString()
  readonly devicesStatus: string;
}

export class CreatedDeviceEvent extends Event {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FlatDeviceStatus)
  readonly data: FlatDeviceStatus;
}
