import { BadRequestException, CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { City } from '@weather-forecast/models';
import { WeatherApiFactory } from '../../weather/services/weatherApiFactory.service';
import { CitiesController } from '../controllers/cities.controller';
import { CitiesService } from '../services/cities.service';
import { CityList } from '../services/cityList.service';

describe('CitiesController', () => {
  let citiesController: CitiesController;
  let citiesService: CitiesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        CitiesService,
        { provide: CityList, useValue: {} },
        { provide: WeatherApiFactory, useValue: { getClient: () => {} } },
        { provide: CACHE_MANAGER, useFactory: jest.fn() },
      ],
    }).compile();

    citiesService = moduleRef.get<CitiesService>(CitiesService);
    citiesController = moduleRef.get<CitiesController>(CitiesController);
  });

  describe('get city timezone', () => {
    it('should return city timezone for valid city id', async () => {
      const cityId = 1243;
      const timezone = -240;

      jest
        .spyOn(citiesService, 'getCityTimezone')
        .mockImplementation((cityId) => Promise.resolve(timezone));

      expect(await citiesController.getCityTimezone(cityId.toString())).toBe(
        timezone,
      );
    });

    it('should throw BadRequest for missed cityId', async () => {
      await expect(
        async () => await citiesController.getCityTimezone(null),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequest for wrong city id', async () => {
      await expect(
        async () => await citiesController.getCityTimezone('1w3h'),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('get city autocomplete', () => {
    it('should use empty query if no query were passed', async () => {
      const city: City = {
        id: 1,
        name: 'Toronto',
        country: 'CA',
      };

      const spy = jest.spyOn(citiesService, 'autoCompleteCitiesAsync');
      spy.mockImplementation((q) => Promise.resolve([city]));

      expect(
        await citiesController.getAutoCompleteSuggestionsAsync(undefined),
      ).toContain(city);

      expect(spy).toBeCalledTimes(1);
    });
  });
});
