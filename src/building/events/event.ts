import { IsString, IsNotEmpty, Equals, IsNumber } from 'class-validator';

export class Event {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  @Equals('event')
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly action: string;

  @IsNotEmpty()
  @IsNumber()
  readonly timestamp: number;
}
