import {
  BadRequestException,
  CacheInterceptor,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { City } from '@weather-forecast/models';

@Controller('api/city')
@UseInterceptors(CacheInterceptor)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  // @Get(':country/:name')
  // async getCityIdAsync(@Param('country') country: string, @Param('name') name: string): Promise<number> {
  //   if (!country) {
  //     throw new BadRequestException('Country is required');
  //   }

  //   if (!name) {
  //     throw new BadRequestException('City name is required');
  //   }

  //   const city =  await this.citiesService.getCityIdAsync(country, name);
  //   if (!city) {
  //     throw new NotFoundException(`Can't find city ${name} in ${country}`);
  //   }

  //   return city.id;
  // }

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
