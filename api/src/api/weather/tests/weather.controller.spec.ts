import { BadRequestException, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Forecast, WeatherForecast } from '@weather-forecast/models';
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
        { provide: WeatherApiFactory, useValue: { getClient: () => {} } },
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

  describe('combined weather', () => {
    it('should return combined weather for valid city id', async () => {
      const cityId = '1243';

      const weather = {
        type: 'Clouds',
        icon: '2d',
        description: 'few clouds',
        temperature: 30,
        temperature_min: 15,
        temperature_max: 35,
        feels_like: 45,
      } as CurrentWeather;

      const forecast: Forecast = {
        // @ts-expect-error Tests
        1: {
          temperature: 10,
        },
        // @ts-expect-error Tests
        2: {
          temperature: 15,
        },
      };

      const response: WeatherForecast = {
        forecast: forecast,
        currentWeather: weather,
        city: {
          id: parseInt(cityId),
          name: 'Toronto',
          country: 'CA',
        },
        timezone: -240,
      };

      jest
        .spyOn(weatherService, 'getWeatherAndForecastByCityIdAsync')
        .mockImplementation((cityId) => Promise.resolve(response));

      expect(
        await weatherController.getWeatherAndForecastByCityIdAsync(cityId),
      ).toBe(response);
    });

    it('should throw BadRequest for not valid city id', async () => {
      const cityId = '1243f';

      await expect(
        async () =>
          await weatherController.getWeatherAndForecastByCityIdAsync(cityId),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequest for missed city id', async () => {
      const cityId = null;

      await expect(
        async () =>
          await weatherController.getWeatherAndForecastByCityIdAsync(cityId),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('combined weather by coordinates', () => {
    it('should return combined weather for coordinates', async () => {
      const cityId = '1243';

      const latitude = '112.53';
      const longitude = '-45.345';

      const weather = {
        type: 'Clouds',
        icon: '2d',
        description: 'few clouds',
        temperature: 30,
        temperature_min: 15,
        temperature_max: 35,
        feels_like: 45,
      } as CurrentWeather;

      const forecast: Forecast = {
        // @ts-expect-error Tests
        1: {
          temperature: 10,
        },
        // @ts-expect-error Tests
        2: {
          temperature: 15,
        },
      };

      const response: WeatherForecast = {
        forecast: forecast,
        currentWeather: weather,
        city: {
          id: parseInt(cityId),
          name: 'Toronto',
          country: 'CA',
        },
        timezone: -240,
      };

      jest
        .spyOn(weatherService, 'getWeatherAndForecastByCoordinatesAsync')
        .mockImplementation((cityId) => Promise.resolve(response));

      expect(
        await weatherController.getWeatherAndForecastByCoordinatesAsync(
          latitude,
          longitude,
        ),
      ).toBe(response);
    });

    it('should throw BadRequest for not valid latitude', async () => {
      const latitude = '112.5f3';
      const longitude = '-45.345';

      await expect(
        async () =>
          await weatherController.getWeatherAndForecastByCoordinatesAsync(
            latitude,
            longitude,
          ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequest for missed latitude', async () => {
      const latitude = null;
      const longitude = '-45.345';

      await expect(
        async () =>
          await weatherController.getWeatherAndForecastByCoordinatesAsync(
            latitude,
            longitude,
          ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequest for not valid longitude', async () => {
      const latitude = '112.53';
      const longitude = '-45.3ds45';

      await expect(
        async () =>
          await weatherController.getWeatherAndForecastByCoordinatesAsync(
            latitude,
            longitude,
          ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequest for missed longitude', async () => {
      const latitude = '112.53';
      const longitude = null;

      await expect(
        async () =>
          await weatherController.getWeatherAndForecastByCoordinatesAsync(
            latitude,
            longitude,
          ),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
