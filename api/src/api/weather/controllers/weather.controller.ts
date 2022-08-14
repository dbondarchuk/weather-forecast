import {
  BadRequestException,
  CacheInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentWeather } from '@weather-forecast/models';
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
}
