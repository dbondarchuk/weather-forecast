import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenWeatherMap from 'openweathermap-ts';

@Injectable()
export class WeatherApiFactory {
  private readonly apikey: string;

  constructor(private readonly configService: ConfigService) {
    this.apikey = this.configService.get<string>('OPENWEATHERMAP_API_KEY');
  }

  getClient(): OpenWeatherMap {
    const api = new OpenWeatherMap({
      apiKey: this.apikey,
    });

    api.setUnits('metric');

    return api;
  }
}
