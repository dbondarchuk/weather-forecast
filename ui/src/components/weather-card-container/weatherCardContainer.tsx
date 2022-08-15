import { City } from '@weather-forecast/models';
import React from 'react';

import Cookies from 'universal-cookie';

import { WeatherCard } from '../weather-card/weatherCard';
import { getApiUrl } from '../../helpers';
import moment from 'moment';

const defaultCity: City = {
  name: 'Toronto',
  country: 'CA',
  id: 6167865,
};

const cityCookieName = 'city';

interface WeatherCardContainerState {
  city?: City;
}

export class WeatherCardContainer extends React.Component<
  {},
  WeatherCardContainerState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      city: undefined,
    };
  }

  async fetchCityByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<City> {
    const response = await fetch(
      `${getApiUrl()}/city?lat=${latitude}&lon=${longitude}`,
    );
    return (await response.json()) as City;
  }

  componentDidMount() {
    const cookies = new Cookies();
    const cookie = cookies.get<City>(cityCookieName);
    if (cookie) {
      this.setState({
        city: cookie,
      });
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const city = await this.fetchCityByCoordinates(
              position.coords.latitude,
              position.coords.longitude,
            );
            this.onCityChange(city);
            this.setState({
              city: city,
            });
          },
          () => {
            this.setState({
              city: defaultCity,
            });
          },
        );
      } else {
        this.setState({
          city: defaultCity,
        });
      }
    }
  }

  onCityChange(city: City) {
    const cookies = new Cookies();
    cookies.set(cityCookieName, city, {
      expires: new Date(moment().add(3, 'months').unix() * 1000),
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.city && (
          <WeatherCard
            defaultCity={this.state.city}
            onCityChange={(city) => this.onCityChange(city)}
          />
        )}
      </React.Fragment>
    );
  }
}
