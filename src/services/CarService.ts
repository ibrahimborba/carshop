import { IService } from '../interfaces/IService';
import { ICar, CarZodSchema } from '../interfaces/ICar';
import { IModel } from '../interfaces/IModel';
import { ErrorTypes } from '../errors/catalog';

class Car implements IService<ICar> {
  constructor(private _model:IModel<ICar>) {}

  public async create(obj:unknown):Promise<ICar> {
    const parsed = CarZodSchema.safeParse(obj);
    if (!parsed.success) {
      throw parsed.error;
    }
    return this._model.create(parsed.data);
  }

  public async read():Promise<ICar[]> {
    const cars = await this._model.read();  
    return cars;
  }

  public async readOne(_id:string):Promise<ICar> {
    const frame = await this._model.readOne(_id);
    if (!frame) throw new Error(ErrorTypes.EntityNotFound);
    return frame;
  }
}

export default Car;