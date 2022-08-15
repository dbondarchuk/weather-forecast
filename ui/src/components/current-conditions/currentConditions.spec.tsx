import { render, screen } from '@testing-library/react';
import { CurrentWeather } from '@weather-forecast/models';
import React from 'react';
import { roundUpTemperature } from '../../helpers';

import { CurrentConditions } from './currentConditions';

describe('CurrentConditions', () => {
  it('renders current conditions correctly', async () => {
    const weather: CurrentWeather = {
      icon: '2D',
      type: 'Clouds',
      description: 'a few clouds',
      feels_like: 25.892,
      temperature: 24.2345,
      temperature_max: 29.4554,
      temperature_min: 12.44564,
    };

    render(<CurrentConditions weather={weather} />);

    const currentTemperature = screen.getByTestId('current-temperature');
    expect(currentTemperature.textContent).toContain(
      `${roundUpTemperature(weather.temperature)}°C`,
    );

    const feelsLike = screen.getByTestId('feels-like');
    expect(feelsLike.textContent).toContain(
      `${roundUpTemperature(weather.feels_like)}°C`,
    );

    const temperatureMinMax = screen.getByTestId('min-max-temperature');
    expect(temperatureMinMax.textContent).toContain(
      `${roundUpTemperature(weather.temperature_max)}°C`,
    );
    expect(temperatureMinMax.textContent).toContain(
      `${roundUpTemperature(weather.temperature_min)}°C`,
    );
  });
});
