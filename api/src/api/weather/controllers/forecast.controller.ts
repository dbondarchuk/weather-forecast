import {
  BadRequestException,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { WeatherService } from '../services/weather.service';
import { Forecast } from '@weather-forecast/models';

@Controller('api/forecast')
@UseInterceptors(CacheInterceptor)
export class ForecastController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('city/:cityId')
  async getForecastByCityIdAsync(
    @Param('cityId') cityIdStr: string,
  ): Promise<Forecast> {
    if (!cityIdStr) {
      throw new BadRequestException('CityId is required');
    }

    const cityId = Number(cityIdStr);
    if (isNaN(cityId)) {
      throw new BadRequestException('CityId should be an integer');
    }

    return await this.weatherService.getForecastByCityIdAsync(cityId);
  }
}
