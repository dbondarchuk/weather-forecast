import { Weather } from './weather';

export type CurrentWeather = Weather & {
  feels_like: number;
};
