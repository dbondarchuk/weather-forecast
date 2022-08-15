import { render, screen } from '@testing-library/react';
import { Weather } from '@weather-forecast/models';
import moment from 'moment';
import React from 'react';

import { HourlyForecast } from './hourlyForecast';

describe('HourlyForecast', () => {
  it('renders hourly forecast correctly', async () => {
    const weathers: Record<number, Weather> = {
      1: {
        icon: '2D',
        type: 'Clouds',
        description: 'a few clouds',
        temperature: 24.2345,
        temperature_max: 29.4554,
        temperature_min: 12.44564,
      },
      2: {
        icon: '2D',
        type: 'Sunny',
        description: 'no clouds',
        temperature: 25.7,
        temperature_max: 29.3,
        temperature_min: 12.1,
      },
    };

    const date = moment();

    render(<HourlyForecast date={date} weathers={weathers} />);

    const title = screen.getByTestId('hourly-title');
    expect(title.textContent).toBe(
      `Hourly for ${date.format('dddd, MMMM Do')}`,
    );

    const items = screen.queryAllByTestId('hourly-forecast-item');
    expect(items.length).toBe(2);
  });
});
