import React from 'react';

import './weatherCard.scss';

import {
  CurrentWeather as CurrentWeatherModel,
  City as CityModel,
  Forecast,
  FORECAST_DATE_FORMAT,
  ForecastGroup,
} from '@weather-forecast/models';
import { CurrentConditions } from '../current-conditions/currentConditions';
import { WeatherCardHeader } from '../weather-card-header/weatherCardHeader';
import { NextDaysForecast } from '../next-days-forecast/nextDaysForecast';
import {
  HourlyForecast,
  HourlyForecastProperties,
} from '../hourly-forecast/hourlyForecast';
import moment from 'moment';
import { getApiUrl } from '../../helpers';

export interface WeatherCardProperties {
  defaultCity: CityModel;
}

interface WeatherCardState {
  selected?: HourlyForecastProperties;
  city?: CityModel;
  weather?: CurrentWeatherModel;
  forecast?: ForecastGroup;
  timezone: number;
}

export class WeatherCard extends React.Component<
  WeatherCardProperties,
  WeatherCardState
> {
  constructor(readonly props: WeatherCardProperties) {
    super(props);

    this.state = {
      selected: undefined,
      timezone: NaN,
      city: this.props.defaultCity,
    };
  }

  private buildForecast(forecast: Forecast, timezone: number): ForecastGroup {
    return Object.keys(forecast)
      .filter((key) => !isNaN(Number(key)))
      .map((key) => Number(key))
      .map((key) => {
        const weather = forecast[key];
        const date = moment(key * 1000).utcOffset(timezone);
        return {
          date: date.format(FORECAST_DATE_FORMAT),
          time: date.get('hours'),
          weather: weather,
        };
      })
      .reduce((group, item) => {
        const { date } = item;
        group[date] = group[date] ?? {};
        group[date][item.time] = item.weather;

        return group;
      }, {} as ForecastGroup);
  }

  selectDay(date: moment.Moment) {
    this.setState({
      selected: {
        date: date,
        weathers: this.state.forecast
          ? this.state.forecast[date.format(FORECAST_DATE_FORMAT)]
          : [],
      },
    });
  }

  onChangeCity(city: CityModel) {
    this.setState(
      {
        city: city,
      },
      () => this.fetchData(),
    );
  }

  async fetchWeather(): Promise<CurrentWeatherModel> {
    const body = await fetch(
      `${getApiUrl()}/weather/city/${this.state.city?.id}`,
    );
    return (await body.json()) as CurrentWeatherModel;
  }

  async fetchForecast(): Promise<Forecast> {
    const body = await fetch(
      `${getApiUrl()}/forecast/city/${this.state.city?.id}`,
    );

    return (await body.json()) as Forecast;
  }

  async fetchTimezone(): Promise<number> {
    const response = await fetch(
      `${getApiUrl()}/city/${this.state.city?.id}/timezone`,
    );

    const body = await response.json();

    return body as number;
  }

  async fetchData() {
    const result = await Promise.all([
      this.fetchTimezone(),
      this.fetchWeather(),
      this.fetchForecast(),
    ]);
    this.setState(
      {
        timezone: result[0],
        weather: result[1],
        forecast: this.buildForecast(result[2], result[0]),
      },
      () => {
        this.selectDay(
          moment(Object.keys(this.state.forecast!)[0], FORECAST_DATE_FORMAT),
        );
      },
    );
  }

  async componentDidMount() {
    await this.fetchData();
  }

  render() {
    return (
      <div className="col-md-12 col-xl-10">
        <div
          className="card shadow-0 border border-3 weather-card"
          style={{
            backgroundImage: this.state.city
              ? 'url("https://source.unsplash.com/1920x1080/?' +
                this.state.city.name +
                ',city")'
              : 'none',
          }}
        >
          <div className="card-body p-4">
            <div className="row text-center">
              <div className="col-md-9 text-center border-2 py-4 main-card">
                {this.state.city && !isNaN(this.state.timezone) && (
                  <WeatherCardHeader
                    city={this.state.city}
                    onChangeCity={(city) => this.onChangeCity(city)}
                    timezone={this.state.timezone}
                  />
                )}
                {this.state.weather && (
                  <CurrentConditions weather={this.state.weather} />
                )}
                {this.state.forecast && (
                  <NextDaysForecast
                    forecast={this.state.forecast}
                    onSelectForecastDay={(date) => this.selectDay(date)}
                    selected={this.state.selected?.date}
                  />
                )}
              </div>
              <div className="col-md-3 text-md-end">
                {this.state.selected && (
                  <HourlyForecast {...this.state.selected} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
