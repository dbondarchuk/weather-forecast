import { CacheModule, Module } from '@nestjs/common';
import { WeatherModule } from '../weather/weather.module';
import { CitiesController } from './controllers/cities.controller';
import { CitiesService } from './services/cities.service';
import { CityList } from './services/cityList.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 3600,
    }),
    WeatherModule,
  ],
  controllers: [CitiesController],
  providers: [CitiesService, CityList],
})
export class CitiesModule {}
