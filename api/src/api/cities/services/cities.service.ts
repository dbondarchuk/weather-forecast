import { Injectable } from '@nestjs/common';
import OpenWeatherMap from 'openweathermap-ts';
import { City } from '@weather-forecast/models';
import { CityList } from './cityList.service';
import { WeatherApiFactory } from '../../weather/services/weatherApiFactory.service';

@Injectable()
export class CitiesService {
  private readonly weatherClient: OpenWeatherMap;
  constructor(
    private readonly cityList: CityList,
    private readonly weatherClientFactory: WeatherApiFactory,
  ) {
    this.weatherClient = weatherClientFactory.getClient();
  }

  async autoCompleteCitiesAsync(query: string): Promise<City[]> {
    query = query.toLocaleLowerCase();

    return this.cityList
      .getCities()
      .filter(
        (city) =>
          (
            city.name.toLocaleLowerCase() +
            ', ' +
            city.country.toLocaleLowerCase()
          ).indexOf(query) >= 0,
      )
      .slice(0, 10);
  }

  async getCityTimezone(cityId: number): Promise<number> {
    const result = await this.weatherClient.getCurrentWeatherByCityId(cityId);
    return result.timezone / 60;
  }

  async getCityByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<City> {
    const result = await this.weatherClient.getCurrentWeatherByGeoCoordinates(
      latitude,
      longitude,
    );
    return {
      id: result.id,
      name: result.name,
      country: result.sys.country,
    };
  }
}
