import React from 'react';
import { Weather } from '@weather-forecast/models';
import { ConditionsIcon } from '../conditions-icon/conditionsIcon';
import { roundUpTemperature } from '../../helpers';

export interface HourlyForecastItemProperties {
  weather: Weather;
  hour: number;
}

export class HourlyForecastItem extends React.Component<HourlyForecastItemProperties> {
  render() {
    return (
      <div className="pb-0 mb-0" data-testid="hourly-forecast-item">
        <span className="pe-2" data-testid="hour">
          {this.props.hour}:00
        </span>
        <strong data-testid="temperature">
          {roundUpTemperature(this.props.weather.temperature)}°C
        </strong>
        <ConditionsIcon
          icon={this.props.weather.icon}
          type={this.props.weather.type}
          description={this.props.weather.description}
        />
      </div>
    );
  }
}
