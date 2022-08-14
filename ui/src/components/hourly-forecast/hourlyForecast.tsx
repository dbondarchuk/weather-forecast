import moment from 'moment';
import React from 'react';
import { Weather } from '@weather-forecast/models';
import { ConditionsIcon } from '../conditions-icon/conditionsIcon';

export interface HourlyForecastProperties {
  date: moment.Moment;
  weathers: Record<number, Weather>;
}

export class HourlyForecast extends React.Component<HourlyForecastProperties> {
  render() {
    return (
      <div>
        <p className="small mt-3 mb-md-2 pb-md-2">
          Hourly for {this.props.date.format('dddd, MMMM Do')}
        </p>
        {Object.keys(this.props.weathers)
          .filter((key) => !isNaN(Number(key)))
          .map((key) => {
            const weather = this.props.weathers[Number(key)];
            return (
              <p className="pb-0 mb-0" key={key}>
                <span className="pe-2">{key}:00</span>
                <strong>{parseFloat(weather.temperature.toFixed(1))}°C</strong>
                <ConditionsIcon
                  icon={weather.icon}
                  type={weather.type}
                  description={weather.description}
                />
              </p>
            );
          })}
      </div>
    );
  }
}
