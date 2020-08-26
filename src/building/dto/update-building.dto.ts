import { IsInt, IsOptional, IsString } from 'class-validator';


export class UpdateBuildingDto {

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsInt()
  @IsOptional()
  nbOfFloor: number;

  @IsOptional()
  updateAt: Date;
}
