import moment from 'moment';
import React from 'react';
import { Weather } from '@weather-forecast/models';
import { HourlyForecastItem } from './hourlyForecastItem';

export interface HourlyForecastProperties {
  date: moment.Moment;
  weathers: Record<number, Weather>;
}

export class HourlyForecast extends React.Component<HourlyForecastProperties> {
  render() {
    return (
      <div>
        <p className="small mt-3 mb-md-2 pb-md-2" data-testid="hourly-title">
          Hourly for {this.props.date.format('dddd, MMMM Do')}
        </p>
        {Object.keys(this.props.weathers)
          .filter((key) => !isNaN(Number(key)))
          .map((key) => {
            const weather = this.props.weathers[Number(key)];
            return (
              <HourlyForecastItem
                hour={Number(key)}
                weather={weather}
                key={key}
              />
            );
          })}
      </div>
    );
  }
}
