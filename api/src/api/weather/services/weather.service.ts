import { CacheInterceptor, Injectable, UseInterceptors } from '@nestjs/common';
import OpenWeatherMap from 'openweathermap-ts';
import {
  CurrentWeather,
  Weather,
  Forecast,
  WeatherForecast,
} from '@weather-forecast/models';
import { WeatherApiFactory } from './weatherApiFactory.service';
import {
  CurrentResponse,
  ThreeHourResponse,
} from 'openweathermap-ts/dist/types';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class WeatherService {
  private readonly weatherClient: OpenWeatherMap;

  constructor(private readonly weatherClientFactory: WeatherApiFactory) {
    this.weatherClient = weatherClientFactory.getClient();
  }

  async getWeatherByCityIdAsync(cityId: number): Promise<CurrentWeather> {
    const response = await this.weatherClient.getCurrentWeatherByCityId(cityId);
    return WeatherService.getCurrentWeather(response);
  }

  async getForecastByCityIdAsync(cityId: number): Promise<Forecast> {
    const response = await this.weatherClient.getThreeHourForecastByCityId(
      cityId,
    );

    return WeatherService.getForecast(response);
  }

  async getWeatherAndForecastByCityIdAsync(
    cityId: number,
  ): Promise<WeatherForecast> {
    const weatherPromise = this.weatherClient.getCurrentWeatherByCityId(cityId);
    const forecastPromise =
      this.weatherClient.getThreeHourForecastByCityId(cityId);

    const responses = await Promise.all([weatherPromise, forecastPromise]);
    return WeatherService.getWeatherForecast(responses[0], responses[1]);
  }

  async getWeatherAndForecastByCoordinatesAsync(
    latitude: number,
    longitude: number,
  ): Promise<WeatherForecast> {
    const weatherPromise = this.weatherClient.getCurrentWeatherByGeoCoordinates(
      latitude,
      longitude,
    );
    const forecastPromise =
      this.weatherClient.getThreeHourForecastByGeoCoordinates(
        latitude,
        longitude,
      );

    const responses = await Promise.all([weatherPromise, forecastPromise]);
    return WeatherService.getWeatherForecast(responses[0], responses[1]);
  }

  private static getCurrentWeather(response: CurrentResponse) {
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

  private static getForecast(response: ThreeHourResponse) {
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

  private static getWeatherForecast(
    current: CurrentResponse,
    forecast: ThreeHourResponse,
  ): WeatherForecast {
    return {
      currentWeather: WeatherService.getCurrentWeather(current),
      forecast: WeatherService.getForecast(forecast),
      city: {
        id: current.id,
        name: current.name,
        country: current.sys.country,
      },
      timezone: current.timezone,
    };
  }
}
