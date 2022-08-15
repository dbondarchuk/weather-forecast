import { render, screen } from '@testing-library/react';
import { City } from '@weather-forecast/models';
import moment from 'moment';
import React from 'react';

import { WeatherCardHeader } from './weatherCardHeader';

describe('WeatherCardHeader', () => {
  it('renders header correctly', async () => {
    const city: City = {
      id: 1,
      name: 'Toronto',
      country: 'CA',
    };

    const timezone = -240;

    const { container } = render(
      <WeatherCardHeader
        city={city}
        timezone={timezone}
        onChangeCity={() => {}}
      />,
    );

    const currentDate = screen.getByTestId('current-date');
    expect(currentDate.textContent).toBe(
      moment().utcOffset(timezone).format('dddd, MMMM Do'),
    );

    expect(await screen.findByTestId('clock')).not.toBeNull();

    expect(container.textContent).toContain(`${city.name}, ${city.country}`);
  });
});
