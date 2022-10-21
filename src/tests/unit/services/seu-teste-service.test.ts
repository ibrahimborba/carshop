import * as sinon from 'sinon';
import chai from 'chai';
const { expect } = chai;
import { ZodError } from 'zod';
import CarModel from '../../../models/CarModel';
import CarService from '../../../services/CarService';
import { ErrorTypes } from '../../../errors/catalog';
import { carMock, carMockWithId, carMockUpdate, carMockUpdateWithId } from '../../mocks/carMock';

describe('Car Service', () => {

  const carModel = new CarModel();
	const carService = new CarService(carModel);

  before(async () => {
		sinon.stub(carModel, 'create').resolves(carMockWithId);
		sinon.stub(carModel, 'read').resolves([carMockWithId]);
		sinon.stub(carModel, 'readOne')
			.onCall(0).resolves(carMockWithId) 
			.onCall(1).resolves(null); 
  });

  after(() => {
    sinon.restore();
  })

	describe('Create Car', () => {
		it('Success', async () => {
			const carCreated = await carService.create(carMock);
			expect(carCreated).to.be.deep.equal(carMockWithId);
		});

		it('Failure', async () => {
			let error;
			try {
				await carService.create({});
			} catch (err) {
				error = err
			}
			expect(error).to.be.instanceOf(ZodError);
		});
	});

	describe('Find All Cars', () => {
		it('Success', async () => {
			const allCars = await carService.read();
			expect(allCars).to.be.deep.equal([carMockWithId]);
		});
	});

	describe('Find One Car', () => {
		it('Success', async () => {
			const carCreated = await carService.readOne(carMockWithId._id);
			expect(carCreated).to.be.deep.equal(carMockWithId);
		});

		it('Failure', async () => {
      let error;
			try {
				await carService.readOne(carMockWithId._id);
			} catch (err:any) {
				error = err
			}
			expect(error, 'error should be defined').not.to.be.undefined;
			expect(error.message).to.be.deep.equal(ErrorTypes.EntityNotFound);
		});
	});

	describe('Update Car', () => {
		it('Success', async () => {
			sinon.stub(carModel, 'update').resolves(carMockUpdateWithId);

			const updated = await carService.update(carMockUpdateWithId._id, carMockUpdate);
			expect(updated).to.be.deep.equal(carMockUpdateWithId);

			sinon.restore();
		});
		
		it('Failure - Zod', async () => {
			let error;
			try {
				await carService.update(carMockUpdateWithId._id, { INVALID: "OBJECT" })
			} catch(err) {
				error = err;
			}
			expect(error).to.be.instanceOf(ZodError)
		});

		it('Failure - Car not Found', async () => {
			sinon.stub(carModel, 'update').resolves(null);

			let error: any;
			try {
				await carService.update('id', carMockUpdate)
			} catch(err) {
				error = err;
			}
			expect(error?.message).to.be.equal(ErrorTypes.EntityNotFound);

			sinon.restore();
		});
	});

	describe('Delete Car', () => {
		it('Success', async () => {
			sinon.stub(carModel, 'delete').resolves(carMockWithId);

			const deleted = await carService.delete(carMockWithId._id);
			expect(deleted).to.be.deep.equal(carMockWithId);

			sinon.restore();
		});

		it('Failure', async () => {
			sinon.stub(carModel, 'delete').resolves(null);

      let error;
			try {
				await carService.delete(carMockWithId._id);
			} catch (err:any) {
				error = err
			}

			expect(error, 'error should be defined').not.to.be.undefined;
			expect(error.message).to.be.deep.equal(ErrorTypes.EntityNotFound);

			sinon.restore();
		});
	});

});