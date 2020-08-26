import { Document } from 'mongoose';
import { Prop as Property, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collation: { locale: 'en_US', strength: 1, caseLevel: true },
  timestamps: true,
})
export class Building extends Document {
  @Property()
  name: string;

  @Property()
  address: string;

  @Property()
  nbOfFloor: number;

  @Property([String])
  flats: string[];
}

export const BuildingSchema = SchemaFactory.createForClass(Building);

@Schema({
  collation: { locale: 'en_US', strength: 1, caseLevel: true },
  timestamps: true,
})
export class Flat extends Document {
  @Property({ index: true })
  flatId: string;

  @Property({ index: true })
  building: string;

  @Property([Number])
  rooms: number[];

  @Property({ default: false, type: Boolean })
  occupied: boolean;

  @Property({ enum: ['CREATED', 'INIT', 'FAILED'], default: 'INIT' })
  devicesStatus: string;
}

export const FlatSchema = SchemaFactory.createForClass(Flat);
