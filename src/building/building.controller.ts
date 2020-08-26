import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { KafkaEvent, KafkaExceptionFilter, KafkaTopic } from '@building/kafka';
import { Roles, RolesGuard } from '@building/auth';
import { BuildingService } from './building.service';
import { Building, Flat } from './building.schema';
import { MongoPipe } from '@building/validation';
import { CreateBuildingDto, CreateFlatDto, UpdateBuildingDto } from './dto';
import { EventHandler } from './events/event-handler';
import { Event } from './events/event';

@Controller('buildings')
@UseGuards(RolesGuard)
@UseFilters(KafkaExceptionFilter)
@UsePipes(new ValidationPipe())
export class BuildingController {
  constructor(
    private readonly buildingService: BuildingService,
    private readonly eventHandler: EventHandler,
  ) {}

  @Get()
  @Roles('read')
  async findAll(): Promise<Building[]> {
    return this.buildingService.findAll();
  }

  @Get('flats')
  @Roles('read')
  async findAllFlats(): Promise<Flat[]> {
    return this.buildingService.findAllFlats();
  }

  @Get(':id')
  @Roles('read')
  async findOne(@Param('id', new MongoPipe()) id: string): Promise<Building> {
    return this.buildingService.findOne(id);
  }

  @Post()
  @Roles('create')
  async createBuilding(@Body() dto: CreateBuildingDto): Promise<Building> {
    return this.buildingService.createOne(dto, 'building');
  }

  @Put(':id')
  @Roles('update')
  async updateBuilding(@Param('id', new MongoPipe()) id: string, @Body() dto: UpdateBuildingDto): Promise<Building> {
    return this.buildingService.updateOne(id, dto, 'building');
  }

  @Delete(':id')
  @Roles('delete')
  async deleteBuilding(@Param('id', new MongoPipe()) id: string): Promise<string> {
    return this.buildingService.deleteOne(id);
  }

  @Get('flats/:flatId')
  @Roles('read')
  async findOneFlat(
    @Param('id', new MongoPipe()) building: string,
    @Param('id', new MongoPipe()) flatId: string,
  ): Promise<Flat> {
    return this.buildingService.findOneFlat(building, flatId);
  }

  @Post('flats')
  @Roles('create')
  async createFlat(@Body() dto: CreateFlatDto): Promise<Flat> {
    return this.buildingService.createOne(dto, 'flat');
  }

  @Delete('flats/:id')
  @Roles('delete')
  async deleteFlat(@Param('id', new MongoPipe()) id: string): Promise<boolean> {
    return this.buildingService.deleteFlat(id);
  }

  @KafkaTopic('device-created-event')
  async onCreatedDeviceEvent(@KafkaEvent() event: Event): Promise<void> {
    await this.eventHandler.handleEvent(event);
  }

  @KafkaTopic('flat-occupied-event')
  async onFlatOccupiedEvent(@KafkaEvent() event: Event): Promise<void> {
    await this.eventHandler.handleEvent(event);
  }
}
