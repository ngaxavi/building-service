import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Building, Flat } from './building.schema';
import { ClientKafka } from '@nestjs/microservices';
import { LoggerService } from '@building/logger';
import { CreateBuildingDto, CreateFlatDto, UpdateFlatDto } from './dto';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@building/config';

@Injectable()
export class BuildingService {

  constructor(@InjectModel('Building') private readonly model: Model<Building>,
              @InjectModel('Flat') private readonly flatModel: Model<Flat>,
              @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
              private readonly config: ConfigService,
              private readonly logger: LoggerService) {
  }

  async findAll(): Promise<Building[]> {
    this.logger.debug(`BuildingService - get all buildings`);
    return this.model.find({}).exec();
  }

  async findAllFlats(): Promise<Flat[]> {
    this.logger.debug(`BuildingService - get all flats`);
    return this.flatModel.find().exec();
  }

  async findOne(id: string): Promise<Building> {
    this.logger.debug(`BuildingService - get building ${id}`);
    return this.model.findById(id);
  }

  async findOneFlat(building: string, flatId: string): Promise<Flat> {
    this.logger.debug(`BuildingService - get flat ${flatId}`);
    return this.flatModel.findOne({ building, flatId }).exec();
  }

  async createOne(dto: CreateBuildingDto | CreateFlatDto, type: string): Promise<any> {
    const model: Model<any> = type === 'building' ? this.model : this.flatModel;
    this.logger.debug(`BuildingService - create ${type}`);
    const doc = model.create(dto);
    if (type === 'flat') {
      await this.model.findOneAndUpdate({ _id: new Types.ObjectId((dto as CreateFlatDto).building) }, { $push: { flats: (dto as CreateFlatDto).flatId } }, { new: true }).exec();
      this.kafkaClient.emit(`${this.config.getKafka().prefix}-device-create-event`, {
        id: uuid(),
        type: 'event',
        action: 'CreateDevice',
        timestamp: Date.now(),
        data: {
          flatId: (dto as CreateFlatDto).flatId,
        },
      });
    }
    return doc;
  }

  async updateOne(id: string, dto: CreateBuildingDto | CreateFlatDto, type: string): Promise<any> {
    const model: Model<any> = type === 'building' ? this.model : this.flatModel;
    this.logger.debug(`BuildingService - update ${type}`);

    const doc = await model.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $set: dto }, { new: true }).exec();

    if (!doc) {
      throw new NotFoundException();
    }

    return doc;
  }

  async updateFlat(flatId: string, dto: UpdateFlatDto): Promise<Flat> {
    this.logger.debug(`BuildingService - update flat ${flatId}`);

    if (dto.updateAt) {
      delete dto.updateAt;
    }

    const doc = await this.flatModel.findOneAndUpdate({ flatId }, { $set: dto }, { new: true }).exec();

    if (!doc) {
      throw new NotFoundException();
    }

    return doc;
  }

  async deleteOne(id: string): Promise<string> {
    this.logger.debug(`BuildingService - delete building`);
    const deletion = await this.model.deleteOne({ _id: new Types.ObjectId(id) }).exec();
    if (deletion.n < 1) {
      throw new NotFoundException();
    }
    return id;
  }

  async deleteFlat(id: string): Promise<boolean> {
    this.logger.debug(`BuildingService - delete flat`);
    const flat = await this.flatModel.findById(id).exec();

    //remove from building
    await this.model.findOneAndUpdate({ _id: new Types.ObjectId(flat.building) }, { $pull: { flats: flat.flatId } }, { new: true }).exec();

    const deletion = await this.flatModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
    if (deletion.n < 1) {
      throw new NotFoundException();
    }
    this.kafkaClient.emit(`${this.config.getKafka().prefix}-device-delete-event`, {
      id: uuid(),
      type: 'event',
      action: 'DeleteDevice',
      timestamp: Date.now(),
      data: {
        flatId: flat.flatId,
      },
    });
    return true;
  }
}
