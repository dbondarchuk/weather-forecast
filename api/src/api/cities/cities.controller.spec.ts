import {
  BadRequestException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';

describe('WeatherController', () => {
  let citiesController: CitiesController;
  let citiesService: CitiesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [CitiesService],
    }).compile();

    citiesService = moduleRef.get<CitiesService>(CitiesService);
    citiesController = moduleRef.get<CitiesController>(CitiesController);
  });

  // describe('get city by name and country', () => {
  //   it('should return city for valid city name and country', async () => {
  //     const cityId = 1243;
  //     const name = 'city';
  //     const country = 'country';

  //     jest.spyOn(citiesService, 'getCityIdAsync').mockImplementation((country, name) => Promise.resolve({
  //       name: name,
  //       country: country,
  //       id: cityId
  //     }));

  //     expect(await citiesController.getCityIdAsync(country, name)).toBe(cityId);
  //   });

  //   it('should throw BadRequest for missed country', async () => {
  //     await expect(async () => await citiesController.getCityIdAsync(null, 'city')).rejects.toThrowError(BadRequestException);
  //   });

  //   it('should throw BadRequest for missed city', async () => {
  //     await expect(async () => await citiesController.getCityIdAsync('country', null)).rejects.toThrowError(BadRequestException);
  //   });

  //   it('should throw NotFound for unknown city', async () => {
  //     const name = 'city';
  //     const country = 'country';

  //     jest.spyOn(citiesService, 'getCityIdAsync').mockImplementation((country, name) => Promise.resolve(undefined));

  //     await expect(async () => await citiesController.getCityIdAsync(country, name)).rejects.toThrowError(NotFoundException);
  //   });
  // });
});
