import * as sinon from 'sinon';
import chai from 'chai';
const { expect } = chai;
import { ZodError } from 'zod';
import CarModel from '../../../models/CarModel';
import CarService from '../../../services/CarService';
import { ErrorTypes } from '../../../errors/catalog';
import { carMock, carMockWithId } from '../../mocks/carMock';

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
			const frameCreated = await carService.create(carMock);
			expect(frameCreated).to.be.deep.equal(carMockWithId);
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
			const allFrames = await carService.read();
			expect(allFrames).to.be.deep.equal([carMockWithId]);
		});
	});

	describe('Find One Car', () => {
		it('Success', async () => {
			const frameCreated = await carService.readOne(carMockWithId._id);
			expect(frameCreated).to.be.deep.equal(carMockWithId);
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

});