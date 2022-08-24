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
  onLocateMeRequest: () => void;
}

export interface CityState {
  showSelect: boolean;
}

export class City extends React.Component<CityProperties, CityState> {
  private readonly wrapperRef: React.RefObject<any>;

  constructor(props: CityProperties) {
    super(props);
    this.state = {
      showSelect: false,
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  toggleCitySelect() {
    this.setState({
      showSelect: !this.state.showSelect,
    });
  }

  locateMe() {
    this.props.onLocateMeRequest();
  }

  handleClickOutside(event: MouseEvent) {
    if (
      this.state.showSelect &&
      this.wrapperRef &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.setState({
        showSelect: false,
      });
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const url = `${getApiUrl()}/city/autocomplete?q=`;

    return (
      <div
        className="small d-flex flex-row justify-content-end"
        ref={this.wrapperRef}
      >
        <div>
          {!this.state.showSelect && (
            <span
              className="current-city"
              data-testid="current-city"
              onClick={() => this.toggleCitySelect()}
              title="Select other city"
            >
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
          title="Locate me"
          onClick={() => this.locateMe()}
          className="locate-me"
          data-testid="locate-me"
        >
          <FontAwesomeIcon icon={faLocationArrow} />
        </div>
      </div>
    );
  }
}
