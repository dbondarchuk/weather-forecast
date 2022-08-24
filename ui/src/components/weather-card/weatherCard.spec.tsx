import { render, screen, waitFor } from '@testing-library/react';
import { City, CurrentWeather, Forecast } from '@weather-forecast/models';
import moment from 'moment';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { roundUpTemperature } from '../../helpers';

import { WeatherCard } from './weatherCard';

describe('WeatherCard', () => {
  it('renders everything correctly', async () => {
    const city: City = {
      name: 'Toronto',
      country: 'CA',
      id: 6167865,
    };

    const date1 = moment().unix();
    const date2 = moment().add(2, 'days').unix();
    const forecast: Forecast = {
      [date1]: {
        icon: '2D',
        type: 'Clouds',
        description: 'a few clouds',
        temperature: 24.2345,
        temperature_max: 29.4554,
        temperature_min: 12.44564,
      },
      [date2]: {
        icon: '2D',
        type: 'Sunny',
        description: 'no clouds',
        temperature: 25.7,
        temperature_max: 30.3,
        temperature_min: 11.1,
      },
    };

    const currentWeather: CurrentWeather = {
      icon: '2D',
      type: 'Clouds',
      description: 'a few clouds',
      feels_like: 25.892,
      temperature: 24.2345,
      temperature_max: 29.4554,
      temperature_min: 12.44564,
    };

    const timezone = -240;

    act(() => {
      render(
        <WeatherCard
          weatherForecast={{ forecast, currentWeather, timezone, city }}
          onCityChange={() => {}}
          onLocateMeRequest={() => {}}
        />,
      ).container;
    });

    await waitFor(() => {
      const items = screen.queryAllByTestId('next-day-forecast-item');
      expect(items.length).toBe(2);

      expect(items[0].textContent).toContain(
        `${forecast[date1].temperature_max.toFixed(0)}°C`,
      );
      expect(items[1].textContent).toContain(
        `${forecast[date2].temperature_max.toFixed(0)}°C`,
      );
    });

    const clock = screen.getByTestId('clock');
    expect(clock.textContent).toBe(
      moment().utcOffset(timezone).format('HH:mm'),
    );

    const cityElement = screen.getByTestId('current-city');
    expect(cityElement.textContent).toBe(`${city.name}, ${city.country}`);

    const title = screen.getByTestId('hourly-title');
    expect(title.textContent).toBe(
      `Hourly for ${moment(date1 * 1000)
        .utcOffset(timezone)
        .format('dddd, MMMM Do')}`,
    );

    const hourlyItems = screen.getAllByTestId('hourly-forecast-item');
    expect(hourlyItems.length).toBe(1);
    expect(hourlyItems[0].textContent).toContain(
      `${roundUpTemperature(forecast[date1].temperature)}°C`,
    );

    const currentTemperature = screen.getByTestId('current-temperature');
    expect(currentTemperature.textContent).toBe(
      `${roundUpTemperature(currentWeather.temperature)}°C`,
    );
  });
});
