import * as sinon from 'sinon';
import chai from 'chai';
const { expect } = chai;
import { Model } from 'mongoose';
import CarModel from '../../../models/CarModel';
import { carMock, carMockWithId } from '../../mocks/carMock';

describe('Car Model', () => {
  const carModel = new CarModel();

  before(async () => {
		sinon.stub(Model, 'create').resolves(carMockWithId);
		sinon.stub(Model, 'find').resolves([carMockWithId]);
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
});