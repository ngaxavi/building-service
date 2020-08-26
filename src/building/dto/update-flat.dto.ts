import { IsInt, IsMongoId, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateFlatDto {
  @IsOptional()
  @IsString()
  flatId?: string;

  @IsOptional()
  @IsMongoId()
  building: string;

  @IsOptional()
  @IsInt({ each: true })
  rooms?: number[];

  @IsOptional()
  @IsBoolean()
  occupied: boolean;

  @IsString()
  @IsOptional()
  devicesStatus?: string;

  @IsOptional()
  updateAt?: Date;
}
