import * as sinon from 'sinon';
import chai from 'chai';
const { expect } = chai;
import { Model } from 'mongoose';
import CarModel from '../models/Car';
import { carMock, carMockWithId } from '../../mocks/carMock';

describe('Car Model', () => {
  const carModel = new CarModel();

  before(async () => {
		sinon.stub(Model, 'create').resolves(carMockWithId);
  });

  after(() => {
    sinon.restore();
  });

	describe('creating a car', () => {
		it('successfully created', async () => {
			const newCar = await CarModel.create(carMock);
			expect(newCar).to.be.deep.equal(carMockWithId);
		});
	});
});