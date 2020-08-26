import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';


export class CreateFlatDto {

  @IsNotEmpty()
  @IsString()
  flatId: string;

  @IsNotEmpty()
  @IsMongoId()
  building: string;
}
