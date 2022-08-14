import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ForecastController } from './controllers/forecast.controller';
import { WeatherController } from './controllers/weather.controller';
import { WeatherService } from './services/weather.service';
import { WeatherApiFactory } from './services/weatherApiFactory.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl: 600,
    }),
  ],
  controllers: [WeatherController, ForecastController],
  providers: [WeatherService, WeatherApiFactory],
  exports: [WeatherApiFactory],
})
export class WeatherModule {}
