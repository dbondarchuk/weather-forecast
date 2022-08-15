import { City } from '@weather-forecast/models';
import OpenWeatherMap from 'openweathermap-ts';
import { WeatherApiFactory } from '../../weather/services/weatherApiFactory.service';
import { CitiesService } from '../services/cities.service';
import { CityList } from '../services/cityList.service';

describe('CitiesService', () => {
  describe('get city timezone', () => {
    it('should return city timezone for valid city id', async () => {
      const cityId = 1243;
      const timezone = -240;

      const weatherClientMock: jest.Mocked<OpenWeatherMap> = {
        getCurrentWeatherByCityId: (cityId) =>
          // @ts-expect-error Tests
          Promise.resolve({
            timezone: timezone * 60,
          }),
      };

      const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
        // @ts-expect-error Tests
        getClient: () => weatherClientMock,
      };

      // @ts-expect-error Tests
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
        // @ts-expect-error Tests
        getClient: () => {},
      };

      const cityListMock: jest.Mocked<CityList> = {
        // @ts-expect-error Tests
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
        // @ts-expect-error Tests
        getClient: () => {},
      };

      const cityListMock: jest.Mocked<CityList> = {
        // @ts-expect-error Tests
        getCities: () => cities,
      };

      const service = new CitiesService(cityListMock, weatherClientFactoryMock);

      const result = await service.autoCompleteCitiesAsync('OrO');
      expect(result.length).toBe(10);
    });
  });

  describe('get city by location', () => {
    it('should return city for valid coordinates', async () => {
      const latitude = 10;
      const longitude = 10;

      const city: City = {
        id: 1234,
        name: 'Toronto',
        country: 'CA',
      };

      const weatherClientMock: jest.Mocked<OpenWeatherMap> = {
        getCurrentWeatherByGeoCoordinates: (latitude, longitude) =>
          // @ts-expect-error Tests
          Promise.resolve({
            name: city.name,
            id: city.id,
            sys: {
              country: city.country,
            },
          }),
      };

      const weatherClientFactoryMock: jest.Mocked<WeatherApiFactory> = {
        // @ts-expect-error Tests
        getClient: () => weatherClientMock,
      };

      // @ts-expect-error Tests
      const cityListMock: jest.Mocked<CityList> = {};

      const service = new CitiesService(cityListMock, weatherClientFactoryMock);

      const result = await service.getCityByCoordinates(latitude, longitude);
      expect(result.id).toBe(city.id);
      expect(result.name).toBe(city.name);
      expect(result.country).toBe(city.country);
    });
  });
});
