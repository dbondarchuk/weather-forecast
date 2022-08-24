import { City, WeatherForecast } from '@weather-forecast/models';
import React from 'react';

import Cookies from 'universal-cookie';

import { WeatherCard } from '../weather-card/weatherCard';
import { getApiUrl } from '../../helpers';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';

import './weatherCardContainer.scss';

const defaultCityId: number = 6167865;

const cityCookieName = 'city';

export interface WeatherCardContainerProperties {
  onError?: (error: string) => void;
}

interface WeatherCardContainerState {
  weatherForecast?: WeatherForecast;
  showLoader: boolean;
}

export class WeatherCardContainer extends React.Component<
  WeatherCardContainerProperties,
  WeatherCardContainerState
> {
  private updateInterval: string | number | NodeJS.Timer | undefined;

  constructor(props: any) {
    super(props);

    this.state = {
      weatherForecast: undefined,
      showLoader: true,
    };
  }

  async fetchByCoordinates(latitude: number, longitude: number): Promise<void> {
    this.setState({ showLoader: true });

    const response = await fetch(
      `${getApiUrl()}/weather/combined?lat=${latitude}&lon=${longitude}`,
    );

    const weatherForecast = (await response.json()) as WeatherForecast;
    this.saveCityToCookies(weatherForecast.city);
    this.setState({
      weatherForecast,
      showLoader: false,
    });
  }

  async fetchByCityId(cityId: number): Promise<void> {
    this.setState({ showLoader: true });

    const response = await fetch(`${getApiUrl()}/weather/combined/${cityId}`);

    const weatherForecast = (await response.json()) as WeatherForecast;
    this.setState({ weatherForecast, showLoader: false });
  }

  async componentDidMount() {
    const cookies = new Cookies();
    const cookie = cookies.get<City>(cityCookieName);
    if (cookie) {
      await this.fetchByCityId(cookie.id);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await this.fetchByCoordinates(
              position.coords.latitude,
              position.coords.longitude,
            );
          },
          () => {
            this.showError(
              "Can't get your location. Please verify that you have granted the permission for the location.",
            );
            this.fetchByCityId(defaultCityId);
          },
        );
      } else {
        this.showError(
          "Your browser doesn't support obtaining your location. Please select your location manually",
        );
        this.fetchByCityId(defaultCityId);
      }
    }
  }

  async onCityChange(city: City) {
    this.saveCityToCookies(city);

    await this.fetchByCityId(city.id);
  }

  async onLocateMeRequest() {
    if (navigator.geolocation) {
      this.setState({ showLoader: true });
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await this.fetchByCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        () => {
          this.setState({ showLoader: false });
          this.showError(
            "Can't get your location. Please verify that you have granted the permission for the location.",
          );
        },
      );
    } else {
      this.showError(
        "Your browser doesn't support obtaining your location. Please select your location manually",
      );
    }
  }

  saveCityToCookies(city: City) {
    const cookies = new Cookies();
    cookies.set(cityCookieName, city, {
      expires: new Date(moment().add(3, 'months').unix() * 1000),
    });
  }

  showError(error: string) {
    console.error(error);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    return this.state.weatherForecast && !this.state.showLoader ? (
      <WeatherCard
        weatherForecast={this.state.weatherForecast}
        onLocateMeRequest={async () => await this.onLocateMeRequest()}
        onCityChange={async (city) => await this.onCityChange(city)}
      />
    ) : (
      <div className="loading" title="Loading...">
        <Spinner
          animation="grow"
          variant="danger"
          className="spinner spinner-0"
        />
        <Spinner
          animation="grow"
          variant="warning"
          className="spinner spinner-1"
        />
        <Spinner
          animation="grow"
          variant="info"
          className="spinner spinner-2"
        />
        <Spinner
          animation="grow"
          variant="primary"
          className="spinner spinner-3"
        />
        <Spinner
          animation="grow"
          variant="success"
          className="spinner spinner-4"
        />
      </div>
    );
  }
}
