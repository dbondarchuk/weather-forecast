import { Injectable } from '@nestjs/common';
import OpenWeatherMap from 'openweathermap-ts';
import { City } from '@weather-forecast/models';
import { CityList } from './cityList.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CitiesService {
  private readonly api: OpenWeatherMap;
  constructor(
    private readonly cityList: CityList,
    private readonly configService: ConfigService,
  ) {
    this.api = new OpenWeatherMap({
      apiKey: this.configService.get<string>('OPENWEATHERMAP_API_KEY'),
    });
  }

  async getCityIdAsync(country: string, name: string): Promise<City> {
    name = name.toLocaleLowerCase();
    country = country.toLocaleLowerCase();

    return this.cityList
      .getCities()
      .find(
        (city) =>
          city.name.toLocaleLowerCase() === name &&
          city.country.toLocaleLowerCase() == country,
      );
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
    const result = await this.api.getCurrentWeatherByCityId(cityId);
    //console.log(`cityId: ${cityId}, response: ${JSON.stringify(result)} TZ: ${result.timezone}`);
    return result.timezone / 60;
  }
}
