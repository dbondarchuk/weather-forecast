import {
  BadRequestException,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentWeather, WeatherForecast } from '@weather-forecast/models';
import { WeatherService } from '../services/weather.service';

@Controller('api/weather')
@UseInterceptors(CacheInterceptor)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('city/:cityId')
  async getWeatherByCityIdAsync(
    @Param('cityId') cityIdStr: string,
  ): Promise<CurrentWeather> {
    if (!cityIdStr) {
      throw new BadRequestException('CityId is required');
    }

    const cityId = Number(cityIdStr);
    if (isNaN(cityId)) {
      throw new BadRequestException('CityId should be an integer');
    }

    return await this.weatherService.getWeatherByCityIdAsync(cityId);
  }

  @Get('combined')
  async getWeatherAndForecastByCoordinatesAsync(
    @Query('lat') latitudeStr: string,
    @Query('lon') longitudeStr: string,
  ): Promise<WeatherForecast> {
    if (!latitudeStr) {
      throw new BadRequestException('Latitude is required');
    }

    const latitude = Number(latitudeStr);
    if (isNaN(latitude)) {
      throw new BadRequestException('Latitude should be an integer');
    }
    if (!longitudeStr) {
      throw new BadRequestException('Latitude is required');
    }

    const longitude = Number(longitudeStr);
    if (isNaN(longitude)) {
      throw new BadRequestException('Longitude should be an integer');
    }

    return await this.weatherService.getWeatherAndForecastByCoordinatesAsync(
      latitude,
      longitude,
    );
  }

  @Get('combined/:cityId')
  async getWeatherAndForecastByCityIdAsync(
    @Param('cityId') cityIdStr: string,
  ): Promise<WeatherForecast> {
    if (!cityIdStr) {
      throw new BadRequestException('CityId is required');
    }

    const cityId = Number(cityIdStr);
    if (isNaN(cityId)) {
      throw new BadRequestException('CityId should be an integer');
    }

    return await this.weatherService.getWeatherAndForecastByCityIdAsync(cityId);
  }
}
