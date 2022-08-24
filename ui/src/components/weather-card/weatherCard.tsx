import React from 'react';

import './weatherCard.scss';

import {
  City as CityModel,
  Forecast,
  FORECAST_DATE_FORMAT,
  ForecastGroup,
  WeatherForecast,
} from '@weather-forecast/models';
import { CurrentConditions } from '../current-conditions/currentConditions';
import { WeatherCardHeader } from '../weather-card-header/weatherCardHeader';
import { NextDaysForecast } from '../next-days-forecast/nextDaysForecast';
import {
  HourlyForecast,
  HourlyForecastProperties,
} from '../hourly-forecast/hourlyForecast';
import moment from 'moment';

export interface WeatherCardProperties {
  weatherForecast: WeatherForecast;
  onCityChange: (city: CityModel) => void;
  onLocateMeRequest: () => void;
}

interface WeatherCardState {
  selected?: HourlyForecastProperties;
  forecast?: ForecastGroup;
}

export class WeatherCard extends React.Component<
  WeatherCardProperties,
  WeatherCardState
> {
  constructor(readonly props: WeatherCardProperties) {
    super(props);

    this.state = {
      forecast: undefined,
      selected: undefined,
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
    this.props.onCityChange(city);
  }

  async componentDidMount() {
    if (
      this.props.weatherForecast.forecast &&
      this.props.weatherForecast.timezone
    ) {
      const forecast = this.buildForecast(
        this.props.weatherForecast.forecast,
        this.props.weatherForecast.timezone,
      );
      this.setState(
        {
          forecast: forecast,
        },
        () => {
          this.selectDay(
            moment(Object.keys(this.state.forecast!)[0], FORECAST_DATE_FORMAT),
          );
        },
      );
    }
  }

  render() {
    return (
      <div className="col-md-12 col-xl-10">
        <div
          className="card shadow-0 border border-3 weather-card"
          style={{
            backgroundImage: this.props.weatherForecast?.city
              ? 'url("https://source.unsplash.com/1920x1080/?' +
                this.props.weatherForecast.city.name +
                ',city")'
              : 'none',
          }}
        >
          <div className="card-body p-4">
            <div className="row text-center">
              <div className="col-md-9 text-center border-2 py-4 main-card">
                {this.props.weatherForecast?.city &&
                  this.props.weatherForecast?.timezone &&
                  !isNaN(this.props.weatherForecast.timezone) && (
                    <WeatherCardHeader
                      city={this.props.weatherForecast.city}
                      onLocateMeRequest={() => this.props.onLocateMeRequest()}
                      onChangeCity={(city) => this.onChangeCity(city)}
                      timezone={this.props.weatherForecast.timezone}
                    />
                  )}
                {this.props.weatherForecast?.currentWeather && (
                  <CurrentConditions
                    weather={this.props.weatherForecast.currentWeather}
                  />
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
