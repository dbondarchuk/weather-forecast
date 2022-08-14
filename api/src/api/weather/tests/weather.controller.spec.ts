import { BadRequestException, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrentWeather } from '@weather-forecast/models/weather/currentWeather';
import { WeatherController } from '../controllers/weather.controller';
import { WeatherService } from '../services/weather.service';
import { WeatherApiFactory } from '../services/weatherApiFactory.service';

describe('WeatherController', () => {
  let weatherController: WeatherController;
  let weatherService: WeatherService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
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
        { provide: WeatherApiFactory, useValue: {getClient: () => {}} },
        { provide: CACHE_MANAGER, useFactory: jest.fn() },
      ],
    }).compile();

    weatherService = moduleRef.get<WeatherService>(WeatherService);
    weatherController = moduleRef.get<WeatherController>(WeatherController);
  });

  describe('current weather', () => {
    it('should return current weather for valid city id', async () => {
      const cityId = '1243';

      const response = {
        type: 'Clouds',
        icon: '2d',
        description: 'few clouds',
        temperature: 30,
        temperature_min: 15,
        temperature_max: 35,
        feels_like: 45,
      } as CurrentWeather;

      jest
        .spyOn(weatherService, 'getWeatherByCityIdAsync')
        .mockImplementation((cityId) => Promise.resolve(response));

      expect(await weatherController.getWeatherByCityIdAsync(cityId)).toBe(
        response,
      );
    });
  });

  it('should throw BadRequest for not valid city id', async () => {
    const cityId = '1243f';

    await expect(
      async () => await weatherController.getWeatherByCityIdAsync(cityId),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should throw BadRequest for missed city id', async () => {
    const cityId = null;

    await expect(
      async () => await weatherController.getWeatherByCityIdAsync(cityId),
    ).rejects.toThrowError(BadRequestException);
  });
});
