import * as sinon from 'sinon';
import chai from 'chai';
const { expect } = chai;
import { ZodError } from 'zod';
import CarModel from '../../../models/CarModel';
import CarService from '../../../services/CarService';
import { carMock, carMockWithId } from '../../mocks/carMock';

describe('Car Service', () => {

  const carModel = new CarModel();
	const carService = new CarService(carModel);

  before(async () => {
		sinon.stub(carModel, 'create').resolves(carMockWithId);
		sinon.stub(carModel, 'read').resolves([carMockWithId]);
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

});