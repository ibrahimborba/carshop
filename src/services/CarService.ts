import { IService } from '../interfaces/IService';
import { ICar, CarZodSchema } from '../interfaces/ICar';
import { IModel } from '../interfaces/IModel';

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
}

export default Car;