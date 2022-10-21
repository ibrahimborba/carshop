import * as sinon from 'sinon';
import chai from 'chai';
const { expect } = chai;
import { Model } from 'mongoose';
import CarModel from '../../../models/CarModel';
import { ErrorTypes } from '../../../errors/catalog';
import { carMock, carMockWithId, carMockUpdate, carMockUpdateWithId } from '../../mocks/carMock';

describe('Car Model', () => {
  const carModel = new CarModel();

  before(async () => {
		sinon.stub(Model, 'create').resolves(carMockWithId);
		sinon.stub(Model, 'find').resolves([carMockWithId]);
		sinon.stub(Model, 'findOne').resolves(carMockWithId);
		sinon.stub(Model, 'findByIdAndUpdate').resolves(carMockUpdateWithId);
		sinon.stub(Model, 'findByIdAndDelete').resolves(carMockUpdateWithId);
  });

  after(() => {
    sinon.restore();
  });

	describe('Create Car', () => {
		it('Success', async () => {
			const newCar = await carModel.create(carMock);
			expect(newCar).to.be.deep.equal(carMockWithId);
		});
	});

	describe('Find All Cars', () => {
		it('Success', async () => {
			const allCars = await carModel.read();
			expect(allCars).to.be.deep.equal([carMockWithId]);
		});
	});

	describe('Find One Car', () => {
		it('Success', async () => {
			const carFound = await carModel.readOne(carMockWithId._id);
			expect(carFound).to.be.deep.equal(carMockWithId);
		});

		it('Failure', async () => {
			let error;
			try {
				await carModel.readOne('123ERRADO');
			} catch (err: any) {
				error = err;
			}
			expect(error.message).to.be.eq(ErrorTypes.InvalidMongoId);
		});
	});

	describe('Update Car', () => {
		it('Success', async () => {
			const carUpdated = await carModel.update(carMockUpdateWithId._id, carMockUpdate);
			expect(carUpdated).to.be.deep.equal(carMockUpdateWithId);
		});
	
		it('Failure', async () => {
			let error;
			try {
				await carModel.update('123ERRADO', carMockUpdate);
			} catch (err:any) {
				error = err;
			}
			expect(error.message).to.be.eq(ErrorTypes.InvalidMongoId);
		});
	});

	describe('Delete Car', () => {
		it('Success', async () => {
			const deleted = await carModel.delete(carMockWithId._id);
			expect(deleted).to.be.deep.equal(carMockWithId);
		});

		it('Failure', async () => {
			let error;
			try {
				await carModel.delete('id');
			} catch (err: any) {
				error = err;
			}
			expect(error.message).to.be.eq(ErrorTypes.InvalidMongoId);
		});
	});
});