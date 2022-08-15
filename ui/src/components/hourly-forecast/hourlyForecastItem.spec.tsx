import { render, screen } from '@testing-library/react';
import { Weather } from '@weather-forecast/models';
import React from 'react';
import { roundUpTemperature } from '../../helpers';

import { HourlyForecastItem } from './hourlyForecastItem';

describe('HourlyForecastItem', () => {
  it('renders hourly forecast item correctly', async () => {
    const weather: Weather = {
      icon: '2D',
      type: 'Clouds',
      description: 'a few clouds',
      temperature: 24.2345,
      temperature_max: 29.4554,
      temperature_min: 12.44564,
    };

    const hour = 14;

    const { container } = render(
      <HourlyForecastItem hour={hour} weather={weather} />,
    );

    const temperature = screen.getByTestId('temperature');
    expect(temperature.textContent).toContain(
      `${roundUpTemperature(weather.temperature)}°C`,
    );

    const hourElement = screen.getByTestId('hour');
    expect(hourElement.textContent).toBe(`${hour}:00`);

    const conditionsIcon = screen.queryByTestId('conditions-icon');
    expect(conditionsIcon).not.toBeNull();
    expect(conditionsIcon).toBeVisible();
  });
});
