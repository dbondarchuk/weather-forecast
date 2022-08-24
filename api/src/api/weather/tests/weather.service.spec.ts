import OpenWeatherMap from 'openweathermap-ts';
import { WeatherApiFactory } from '../services/weatherApiFactory.service';
import { WeatherService } from '../services/weather.service';
import {
  CurrentResponse,
  ThreeHourResponse,
} from 'openweathermap-ts/dist/types';
import { City } from '@weather-forecast/models';

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
        // @ts-expect-error Tests
        main: {
          feels_like: 12,
          temp: 13,
          temp_max: 11,
          temp_min: 10,
        },
      };

      const weatherClientMock: jest.Mocked<OpenWeatherMap> = {
        // @ts-expect-error Tests
        getCurrentWeatherByCityId: (cityId) => Promise.resolve(response),
      };

      const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
        // @ts-expect-error Tests
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
            // @ts-expect-error Tests
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
            // @ts-expect-error Tests
            main: {
              temp: 15,
              temp_max: 18,
              temp_min: 10,
            },
          },
        ],
      };

      const weatherClientMock: jest.Mocked<OpenWeatherMap> = {
        // @ts-expect-error Tests
        getThreeHourForecastByCityId: (cityId) => Promise.resolve(response),
      };

      const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
        // @ts-expect-error Tests
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

    describe('getWeatherAndForecastByCityIdAsync', () => {
      it('should return required information for valid city id', async () => {
        const cityId = 1243;

        const timezone = -240;
        const city: City = {
          id: cityId,
          name: 'Toront',
          country: 'CA',
        };

        const currentWeather: CurrentResponse = {
          weather: [
            {
              description: 'a few clouds',
              icon: '2d',
              id: 1,
              main: 'Clouds',
            },
          ],
          // @ts-expect-error Tests
          main: {
            feels_like: 12,
            temp: 13,
            temp_max: 11,
            temp_min: 10,
          },
          id: cityId,
          name: city.name,
          // @ts-expect-error Tests
          sys: {
            country: city.country,
          },
          timezone: timezone,
        };

        const forecast: ThreeHourResponse = {
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
              // @ts-expect-error Tests
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
              // @ts-expect-error Tests
              main: {
                temp: 15,
                temp_max: 18,
                temp_min: 10,
              },
            },
          ],
        };

        const weatherClientMock: jest.Mocked<OpenWeatherMap> = {
          // @ts-expect-error Tests
          getCurrentWeatherByCityId: (cityId) =>
            Promise.resolve(currentWeather),
          // @ts-expect-error Tests
          getThreeHourForecastByCityId: (cityId) => Promise.resolve(forecast),
        };

        const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
          // @ts-expect-error Tests
          getClient: () => weatherClientMock,
        };

        const service = new WeatherService(weatherClientFactoryMock);
        const result = await service.getWeatherAndForecastByCityIdAsync(cityId);

        const forecastResult = result.forecast;
        const currentWeatherResult = result.currentWeather;

        expect(result.timezone).toBe(timezone);
        expect(result.city.id).toBe(cityId);
        expect(result.city.name).toBe(city.name);
        expect(result.city.country).toBe(city.country);

        expect(currentWeatherResult.icon).toBe(currentWeather.weather[0].icon);
        expect(currentWeatherResult.description).toBe(
          currentWeather.weather[0].description,
        );
        expect(currentWeatherResult.type).toBe(currentWeather.weather[0].main);
        expect(currentWeatherResult.temperature).toBe(currentWeather.main.temp);
        expect(currentWeatherResult.temperature_max).toBe(
          currentWeather.main.temp_max,
        );
        expect(currentWeatherResult.temperature_min).toBe(
          currentWeather.main.temp_min,
        );

        expect(forecastResult[1].icon).toBe(forecast.list[0].weather[0].icon);
        expect(forecastResult[1].description).toBe(
          forecast.list[0].weather[0].description,
        );
        expect(forecastResult[1].type).toBe(forecast.list[0].weather[0].main);
        expect(forecastResult[1].temperature).toBe(forecast.list[0].main.temp);
        expect(forecastResult[1].temperature_max).toBe(
          forecast.list[0].main.temp_max,
        );
        expect(forecastResult[1].temperature_min).toBe(
          forecast.list[0].main.temp_min,
        );

        expect(forecastResult[2].icon).toBe(forecast.list[1].weather[0].icon);
        expect(forecastResult[2].description).toBe(
          forecast.list[1].weather[0].description,
        );
        expect(forecastResult[2].type).toBe(forecast.list[1].weather[0].main);
        expect(forecastResult[2].temperature).toBe(forecast.list[1].main.temp);
        expect(forecastResult[2].temperature_max).toBe(
          forecast.list[1].main.temp_max,
        );
        expect(forecastResult[2].temperature_min).toBe(
          forecast.list[1].main.temp_min,
        );
      });
    });
  });

  describe('getWeatherAndForecastByCoordintatesAsync', () => {
    it('should return required information for valid coordinates', async () => {
      const cityId = 1243;
      const latitude = 1;
      const longitude = 2;

      const timezone = -240;
      const city: City = {
        id: cityId,
        name: 'Toront',
        country: 'CA',
      };

      const currentWeather: CurrentResponse = {
        weather: [
          {
            description: 'a few clouds',
            icon: '2d',
            id: 1,
            main: 'Clouds',
          },
        ],
        // @ts-expect-error Tests
        main: {
          feels_like: 12,
          temp: 13,
          temp_max: 11,
          temp_min: 10,
        },
        id: cityId,
        name: city.name,
        // @ts-expect-error Tests
        sys: {
          country: city.country,
        },
        timezone: timezone,
      };

      const forecast: ThreeHourResponse = {
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
            // @ts-expect-error Tests
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
            // @ts-expect-error Tests
            main: {
              temp: 15,
              temp_max: 18,
              temp_min: 10,
            },
          },
        ],
      };

      const weatherClientMock: jest.Mocked<OpenWeatherMap> = {
        // @ts-expect-error Tests
        getCurrentWeatherByGeoCoordinates: (latitude, longitude) =>
          Promise.resolve(currentWeather),
        // @ts-expect-error Tests
        getThreeHourForecastByGeoCoordinates: (latitude, longitude) =>
          Promise.resolve(forecast),
      };

      const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
        // @ts-expect-error Tests
        getClient: () => weatherClientMock,
      };

      const service = new WeatherService(weatherClientFactoryMock);
      const result = await service.getWeatherAndForecastByCoordinatesAsync(
        latitude,
        longitude,
      );

      const forecastResult = result.forecast;
      const currentWeatherResult = result.currentWeather;

      expect(result.timezone).toBe(timezone);
      expect(result.city.id).toBe(cityId);
      expect(result.city.name).toBe(city.name);
      expect(result.city.country).toBe(city.country);

      expect(currentWeatherResult.icon).toBe(currentWeather.weather[0].icon);
      expect(currentWeatherResult.description).toBe(
        currentWeather.weather[0].description,
      );
      expect(currentWeatherResult.type).toBe(currentWeather.weather[0].main);
      expect(currentWeatherResult.temperature).toBe(currentWeather.main.temp);
      expect(currentWeatherResult.temperature_max).toBe(
        currentWeather.main.temp_max,
      );
      expect(currentWeatherResult.temperature_min).toBe(
        currentWeather.main.temp_min,
      );

      expect(forecastResult[1].icon).toBe(forecast.list[0].weather[0].icon);
      expect(forecastResult[1].description).toBe(
        forecast.list[0].weather[0].description,
      );
      expect(forecastResult[1].type).toBe(forecast.list[0].weather[0].main);
      expect(forecastResult[1].temperature).toBe(forecast.list[0].main.temp);
      expect(forecastResult[1].temperature_max).toBe(
        forecast.list[0].main.temp_max,
      );
      expect(forecastResult[1].temperature_min).toBe(
        forecast.list[0].main.temp_min,
      );

      expect(forecastResult[2].icon).toBe(forecast.list[1].weather[0].icon);
      expect(forecastResult[2].description).toBe(
        forecast.list[1].weather[0].description,
      );
      expect(forecastResult[2].type).toBe(forecast.list[1].weather[0].main);
      expect(forecastResult[2].temperature).toBe(forecast.list[1].main.temp);
      expect(forecastResult[2].temperature_max).toBe(
        forecast.list[1].main.temp_max,
      );
      expect(forecastResult[2].temperature_min).toBe(
        forecast.list[1].main.temp_min,
      );
    });
  });
});
