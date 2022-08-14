import React from 'react';
import { Row } from 'react-bootstrap';

import { CurrentWeather as CurrentWeatherModel } from '@weather-forecast/models';
import { ConditionsIcon } from '../conditions-icon/conditionsIcon';

import './currentConditions.scss';

export interface CurrentConditionsProperties {
  weather: CurrentWeatherModel;
}

const roundUpTemperature = (temperature: number) =>
  parseFloat(temperature.toFixed(1));

export class CurrentConditions extends React.Component<CurrentConditionsProperties> {
  render() {
    return (
      <Row className="d-flex justify-content-around align-items-center py-5 my-4">
        <div className="col-md-6 fw-bold mb-0 current-temperature">
          {roundUpTemperature(this.props.weather.temperature)}°C
        </div>
        <div className="col-md-6 text-md-end text-center current-conditions">
          <div className="conditions">
            <span>{this.props.weather.type}</span>
            <ConditionsIcon
              icon={this.props.weather.icon}
              type={this.props.weather.type}
              description={this.props.weather.description}
            />
          </div>
          <div className="feels-like">
            <span>
              Feels like: {roundUpTemperature(this.props.weather.feels_like)}°C
            </span>
          </div>
          <div className="temperature-min-max">
            <span>
              Min: {roundUpTemperature(this.props.weather.temperature_min)}°C,
              Max: {roundUpTemperature(this.props.weather.temperature_max)}°C
            </span>
          </div>
        </div>
      </Row>
    );
  }
}
