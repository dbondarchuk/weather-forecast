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
import { getApiUrl } from '../../http';

export interface WeatherCardProperties {}

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
      timezone: -360,
      city: {
        name: 'Toronto',
        country: 'CA',
        id: 6167865,
      }, // Let's imagine that we can get user's location
    };
  }

  private buildForecast(forecast: Forecast): ForecastGroup {
    return Object.keys(forecast)
      .filter((key) => !isNaN(Number(key)))
      .map((key) => Number(key))
      .map((key) => {
        const weather = forecast[key];
        const date = moment(key * 1000).utcOffset(this.state.timezone);
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

  async fetchWeather() {
    const body = await fetch(
      `${getApiUrl()}/weather/city/${this.state.city?.id}`,
    );
    const weather = (await body.json()) as CurrentWeatherModel;
    this.setState({
      weather: weather,
    });
  }

  async fetchForecast() {
    const body = await fetch(
      `${getApiUrl()}/forecast/city/${this.state.city?.id}`,
    );
    const forecast = (await body.json()) as Forecast;
    this.setState(
      {
        forecast: this.buildForecast(forecast),
      },
      () => {
        this.selectDay(
          moment(Object.keys(this.state.forecast!)[0], FORECAST_DATE_FORMAT),
        );
      },
    );
  }

  async fetchTimezone() {
    const response = await fetch(
      `${getApiUrl()}/city/${this.state.city?.id}/timezone`,
    );
    const body = await response.json();
    const timezone = body as number;
    this.setState({
      timezone: timezone,
    });
  }

  async fetchData() {
    await this.fetchTimezone();
    this.fetchWeather();
    this.fetchForecast();
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
                {this.state.city && (
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
