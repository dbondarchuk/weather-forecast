import { CacheInterceptor, Injectable, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenWeatherMap from 'openweathermap-ts';
import { CurrentWeather, Weather, Forecast } from '@weather-forecast/models';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class WeatherService {
  private readonly api: OpenWeatherMap;

  constructor(private readonly configService: ConfigService) {
    this.api = new OpenWeatherMap({
      apiKey: this.configService.get<string>('OPENWEATHERMAP_API_KEY'),
    });

    this.api.setUnits('metric');
  }

  async getWeatherByCityIdAsync(cityId: number): Promise<CurrentWeather> {
    const response = await this.api.getCurrentWeatherByCityId(cityId);

    return {
      type: response.weather[0].main,
      icon: response.weather[0].icon,
      description: response.weather[0].description,
      temperature: response.main.temp,
      temperature_min: response.main.temp_min,
      temperature_max: response.main.temp_max,
      feels_like: response.main.feels_like,
    } as CurrentWeather;
  }

  async getForecastByCityIdAsync(cityId: number): Promise<Forecast> {
    const response = await this.api.getThreeHourForecastByCityId(cityId);

    return response.list
      .map((item) => {
        return {
          dt: item.dt,
          weather: {
            type: item.weather[0].main,
            icon: item.weather[0].icon,
            description: item.weather[0].description,
            temperature: item.main.temp,
            temperature_min: item.main.temp_min,
            temperature_max: item.main.temp_max,
          } as Weather,
        };
      })
      .reduce((obj, item) => {
        obj[item.dt] = item.weather;
        return obj;
      }, {});
  }
}