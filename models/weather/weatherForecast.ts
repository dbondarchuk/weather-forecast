import { CurrentWeather } from './currentWeather';
import { Forecast } from './forecast';
import { City } from '../cities/city';

export interface WeatherForecast {
  currentWeather: CurrentWeather;
  forecast: Forecast;
  city: City;
  timezone: number;
}
