import { IsInt, IsNotEmpty, IsString } from 'class-validator';


export class CreateBuildingDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsInt()
  @IsNotEmpty()
  nbOfFloor: number;
}
