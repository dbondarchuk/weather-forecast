import { Weather } from './weather';

export type Forecast = Record<number, Weather>;

export type ForecastGroup = Record<string, Forecast>;

export const FORECAST_DATE_FORMAT = 'DD-MM-YYYY';
