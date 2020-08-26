import { Module } from '@nestjs/common';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildingSchema, FlatSchema } from './building.schema';
import { EventHandler } from './events/event-handler';
import { LoggerService } from '@building/logger';


@Module({
  imports: [MongooseModule.forFeature([{name: 'Building', schema: BuildingSchema}, {name: 'Flat', schema: FlatSchema}])],
  controllers: [BuildingController],
  providers: [BuildingService, EventHandler, LoggerService]
})
export class BuildingModule {

}
