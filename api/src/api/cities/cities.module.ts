import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherApiFactory } from '../weather/services/weatherApiFactory.service';
import { CitiesController } from './controllers/cities.controller';
import { CitiesService } from './services/cities.service';
import { CityList } from './services/cityList.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 3600,
    }),
    WeatherApiFactory
  ],
  controllers: [CitiesController],
  providers: [CitiesService, CityList],
})
export class CitiesModule {}
