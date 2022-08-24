import moment from 'moment';
import React from 'react';
import { City as CityModel } from '@weather-forecast/models';
import { City } from '../city/city';
import { Clock } from '../clock/clock';
import { Row } from 'react-bootstrap';

export interface WeatherCardHeaderProperties {
  city: CityModel;
  timezone: number;
  onChangeCity: (city: CityModel) => void;
  onLocateMeRequest: () => void;
}

export class WeatherCardHeader extends React.Component<WeatherCardHeaderProperties> {
  render() {
    return (
      <Row className="d-flex justify-content-around mt-3">
        <div className="col-md-6 text-start">
          <span className="h3 mb-3" data-testid="current-date">
            {moment().utcOffset(this.props.timezone).format('dddd, MMMM Do')}
          </span>
          <Clock timezone={this.props.timezone} />
        </div>
        <div className="col-md-6 text-end">
          <City
            city={this.props.city}
            onLocateMeRequest={() => this.props.onLocateMeRequest()}
            onChangeCity={(city) => this.props.onChangeCity(city)}
          />
        </div>
      </Row>
    );
  }
}
