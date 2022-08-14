import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CityList } from './cityList.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl: 3600,
    }),
  ],
  controllers: [CitiesController],
  providers: [CitiesService, CityList],
})
export class CitiesModule {}
