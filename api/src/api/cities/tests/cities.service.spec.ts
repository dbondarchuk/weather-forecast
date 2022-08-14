import { City } from '@weather-forecast/models';
import OpenWeatherMap from 'openweathermap-ts';
import { WeatherApiFactory } from '../../weather/services/weatherApiFactory.service';
import { CitiesService } from '../services/cities.service';
import { CityList } from '../services/cityList.service';

describe('CitiesService', () => {
  beforeEach(async () => {});

  describe('get city timezone', () => {
    it('should return city timezone for valid city id', async () => {
      const cityId = 1243;
      const timezone = -240;

      const weatherClientMock: jest.Mocked<OpenWeatherMap> = {
        // @ts-expect-error
        getCurrentWeatherByCityId: (cityId) =>
          Promise.resolve({
            timezone: timezone * 60,
          }),
      };

      const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
        // @ts-expect-error
        getClient: () => weatherClientMock,
      };

      // @ts-expect-error
      const cityListMock: jest.Mocked<CityList> = {};

      const service = new CitiesService(cityListMock, weatherClientFactoryMock);

      expect(await service.getCityTimezone(cityId)).toBe(timezone);
    });
  });

  describe('get city autocomple', () => {
    it('should return cities matching query', async () => {
      const city1: City = {
        id: 1,
        name: 'Toronto',
        country: 'CA',
      };

      const city2: City = {
        id: 2,
        name: 'Calgary',
        country: 'CA',
      };

      const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
        // @ts-expect-error
        getClient: () => {},
      };

      const cityListMock: jest.Mocked<CityList> = {
        // @ts-expect-error
        getCities: () => [city1, city2],
      };

      const service = new CitiesService(cityListMock, weatherClientFactoryMock);

      const result = await service.autoCompleteCitiesAsync('OrO');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(city1);
    });

    it('should return max 10 cities matching query', async () => {
      const cities: City[] = [];
      for (let i = 0; i < 20; i++) {
        cities.push({
          id: i,
          name: 'Toronto' + i,
          country: 'CA',
        });
      }

      const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
        // @ts-expect-error
        getClient: () => {},
      };

      const cityListMock: jest.Mocked<CityList> = {
        // @ts-expect-error
        getCities: () => cities,
      };

      const service = new CitiesService(cityListMock, weatherClientFactoryMock);

      const result = await service.autoCompleteCitiesAsync('OrO');
      expect(result.length).toBe(10);
    });
  });
});
