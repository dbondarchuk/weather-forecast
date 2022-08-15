import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { City as CityModel } from '@weather-forecast/models';

import './city.scss';
import Autocomplete from '../autocomplete/autocomplete';
import { getApiUrl } from '../../helpers';

export interface CityProperties {
  city: CityModel;
  onChangeCity: (city: CityModel) => void;
}

export interface CityState {
  showSelect: boolean;
}

export class City extends React.Component<CityProperties, CityState> {
  constructor(props: CityProperties) {
    super(props);
    this.state = {
      showSelect: false,
    };
  }

  toggleCitySelect() {
    this.setState({
      showSelect: !this.state.showSelect,
    });
  }

  changeLocation() {}

  render() {
    const url = `${getApiUrl()}/city/autocomplete?q=`;

    return (
      <div className="small d-flex flex-row justify-content-end">
        <div>
          {!this.state.showSelect && (
            <span className="current-city" data-testid="current-city">
              {this.props.city.name}, {this.props.city.country}
            </span>
          )}
          {this.state.showSelect && (
            <Autocomplete<CityModel>
              value={this.props.city}
              url={url}
              displayFunc={(city) => `${city.name}, ${city.country}`}
              keyFunc={(city) => city.id.toString()}
              onSelect={(item) => {
                this.toggleCitySelect();
                this.props.onChangeCity(item);
              }}
              onEscapeCallback={() => this.toggleCitySelect()}
            />
          )}
        </div>
        <div
          title="Change location"
          onClick={() => this.toggleCitySelect()}
          className="change-location-toggle"
          data-testid="change-location-toggle"
        >
          <FontAwesomeIcon icon={faLocationArrow} />
        </div>
      </div>
    );
  }
}
