import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CitiesModule } from './api/cities/cities.module';
import { WeatherModule } from './api/weather/weather.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    WeatherModule,
    CitiesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'ui', 'build'),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
