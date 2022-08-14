import OpenWeatherMap from 'openweathermap-ts';
import { WeatherApiFactory } from '../services/weatherApiFactory.service';
import { WeatherService } from '../services/weather.service';
import {
  CurrentResponse,
  ThreeHourResponse,
} from 'openweathermap-ts/dist/types';

describe('WeatherService', () => {
  beforeEach(async () => {});

  describe('getWeatherByCityIdAsync', () => {
    it('should return current weather for valid city id', async () => {
      const cityId = 1243;
      const response: CurrentResponse = {
        weather: [
          {
            description: 'a few clouds',
            icon: '2d',
            id: 1,
            main: 'Clouds',
          },
        ],
        // @ts-expect-error
        main: {
          feels_like: 12,
          temp: 13,
          temp_max: 11,
          temp_min: 10,
        },
      };

      const weatherClientMock: jest.Mocked<OpenWeatherMap> = {
        // @ts-expect-error
        getCurrentWeatherByCityId: (cityId) => Promise.resolve(response),
      };

      const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
        // @ts-expect-error
        getClient: () => weatherClientMock,
      };

      const service = new WeatherService(weatherClientFactoryMock);
      const result = await service.getWeatherByCityIdAsync(cityId);

      expect(result.icon).toBe(response.weather[0].icon);
      expect(result.description).toBe(response.weather[0].description);
      expect(result.type).toBe(response.weather[0].main);
      expect(result.temperature).toBe(response.main.temp);
      expect(result.temperature_max).toBe(response.main.temp_max);
      expect(result.temperature_min).toBe(response.main.temp_min);
    });
  });

  describe('getForecastByCityIdAsync', () => {
    it('should return forecast for valid city id', async () => {
      const cityId = 1243;
      const response: ThreeHourResponse = {
        list: [
          {
            dt: 1,
            weather: [
              {
                description: 'a few clouds',
                icon: '2d',
                id: 1,
                main: 'Clouds',
              },
            ],
            // @ts-expect-error
            main: {
              temp: 13,
              temp_max: 11,
              temp_min: 10,
            },
          },
          {
            dt: 2,
            weather: [
              {
                description: 'a l ofot clouds',
                icon: '3d',
                id: 2,
                main: 'Clouds',
              },
            ],
            // @ts-expect-error
            main: {
              temp: 15,
              temp_max: 18,
              temp_min: 10,
            },
          },
        ],
      };

      const weatherClientMock: jest.Mocked<OpenWeatherMap> = {
        // @ts-expect-error
        getThreeHourForecastByCityId: (cityId) => Promise.resolve(response),
      };

      const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
        // @ts-expect-error
        getClient: () => weatherClientMock,
      };

      const service = new WeatherService(weatherClientFactoryMock);
      const result = await service.getForecastByCityIdAsync(cityId);

      expect(result[1].icon).toBe(response.list[0].weather[0].icon);
      expect(result[1].description).toBe(
        response.list[0].weather[0].description,
      );
      expect(result[1].type).toBe(response.list[0].weather[0].main);
      expect(result[1].temperature).toBe(response.list[0].main.temp);
      expect(result[1].temperature_max).toBe(response.list[0].main.temp_max);
      expect(result[1].temperature_min).toBe(response.list[0].main.temp_min);

      expect(result[2].icon).toBe(response.list[1].weather[0].icon);
      expect(result[2].description).toBe(
        response.list[1].weather[0].description,
      );
      expect(result[2].type).toBe(response.list[1].weather[0].main);
      expect(result[2].temperature).toBe(response.list[1].main.temp);
      expect(result[2].temperature_max).toBe(response.list[1].main.temp_max);
      expect(result[2].temperature_min).toBe(response.list[1].main.temp_min);
    });
  });
});
