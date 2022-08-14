import { BadRequestException, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Forecast } from '@weather-forecast/models';
import { ForecastController } from '../controllers/forecast.controller';
import { WeatherService } from '../services/weather.service';
import { WeatherApiFactory } from '../services/weatherApiFactory.service';

describe('ForecastController', () => {
  let forecastController: ForecastController;
  let weatherService: WeatherService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ForecastController],
      providers: [
        WeatherService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'OPENWEATHERMAP_API_KEY') {
                return '123';
              }
              return null;
            }),
          },
        },
        { provide: WeatherApiFactory, useValue: { getClient: () => {} } },
        { provide: CACHE_MANAGER, useFactory: jest.fn() },
      ],
    }).compile();

    weatherService = moduleRef.get<WeatherService>(WeatherService);
    forecastController = moduleRef.get<ForecastController>(ForecastController);
  });

  describe('forecast', () => {
    it('should return current forecast for valid city id', async () => {
      const cityId = '1243';

      const response: Forecast = {
        // @ts-expect-error Tests
        1: {
          temperature: 10,
        },
        // @ts-expect-error Tests
        2: {
          temperature: 15,
        },
      };

      jest
        .spyOn(weatherService, 'getForecastByCityIdAsync')
        .mockImplementation((cityId) => Promise.resolve(response));

      expect(await forecastController.getForecastByCityIdAsync(cityId)).toBe(
        response,
      );
    });
  });

  it('should throw BadRequest for not valid city id', async () => {
    const cityId = '1243f';

    await expect(
      async () => await forecastController.getForecastByCityIdAsync(cityId),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should throw BadRequest for missed city id', async () => {
    const cityId = null;

    await expect(
      async () => await forecastController.getForecastByCityIdAsync(cityId),
    ).rejects.toThrowError(BadRequestException);
  });
});
