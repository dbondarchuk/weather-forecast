import {
  BadRequestException,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CitiesService } from '../services/cities.service';
import { City } from '@weather-forecast/models';

@Controller('api/city')
@UseInterceptors(CacheInterceptor)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get('autocomplete')
  async getAutoCompleteSuggestionsAsync(
    @Query('q') query: string,
  ): Promise<City[]> {
    if (!query) {
      query = '';
    }

    return await this.citiesService.autoCompleteCitiesAsync(query);
  }

  @Get(':id/timezone')
  async getCityTimezone(@Param('id') cityIdStr: string): Promise<number> {
    if (!cityIdStr) {
      throw new BadRequestException('CityId is required');
    }

    const cityId = Number(cityIdStr);
    if (isNaN(cityId)) {
      throw new BadRequestException('CityId should be an integer');
    }

    return await this.citiesService.getCityTimezone(cityId);
  }
}
