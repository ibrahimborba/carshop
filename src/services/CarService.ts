import { IService } from '../interfaces/IService';
import { ICar, CarZodSchema } from '../interfaces/ICar';
import { IModel } from '../interfaces/IModel';
import { ErrorTypes } from '../errors/catalog';

class Car implements IService<ICar> {
  constructor(private _model:IModel<ICar>) {}

  public async create(obj:unknown):Promise<ICar> {
    const parsed = CarZodSchema.safeParse(obj);
    if (!parsed.success) throw parsed.error;
    return this._model.create(parsed.data);
  }

  public async read():Promise<ICar[]> {
    const cars = await this._model.read();  
    return cars;
  }

  public async readOne(_id:string):Promise<ICar> {
    const car = await this._model.readOne(_id);
    if (!car) throw new Error(ErrorTypes.EntityNotFound);
    return car;
  }

  public async update(_id: string, obj: unknown): Promise<ICar> {
    const parsed = CarZodSchema.safeParse(obj);
    if (!parsed.success) throw parsed.error;

    const updated = await this._model.update(_id, parsed.data);
    if (!updated) throw new Error(ErrorTypes.EntityNotFound);
    return updated;
  }
}

export default Car;