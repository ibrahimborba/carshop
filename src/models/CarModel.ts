import { model as mongooseCreateModel, Schema } from 'mongoose';
import { ICar } from '../interfaces/ICar';
import MongoModel from './MongoModel';

const carMongooseSchema = new Schema<ICar>({
  model: String,
  year: Number,
  color: String,
  buyValue: Number,
  seatsQty: Number,
  doorsQty: Number,
});

class Car extends MongoModel<ICar> {
  constructor(model = mongooseCreateModel('Frame', carMongooseSchema)) {
    super(model);
  }
}

export default Car;