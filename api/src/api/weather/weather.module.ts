import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ForecastController } from './forecast.controller';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl: 600,
    }),
  ],
  controllers: [WeatherController, ForecastController],
  providers: [WeatherService],
})
export class WeatherModule {}
