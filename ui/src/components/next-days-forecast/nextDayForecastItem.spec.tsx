import { render, screen, fireEvent } from '@testing-library/react';
import { Weather } from '@weather-forecast/models';
import moment from 'moment';
import React from 'react';

import { NextDayForecastItem } from './nextDayForecastItem';

describe('NextDayForecastItem', () => {
  it('renders next day forecast item correctly', async () => {
    const weather: Weather = {
      icon: '2D',
      type: 'Clouds',
      description: 'a few clouds',
      temperature: 24.2345,
      temperature_max: 29.4554,
      temperature_min: 12.44564,
    };

    const date = moment();

    render(
      <NextDayForecastItem
        {...weather}
        date={date}
        onClick={() => {}}
        isSelected={true}
      />,
    );

    const temperature = screen.getByTestId('temperature');
    expect(temperature.textContent).toContain(
      `${weather.temperature.toFixed(0)}°C`,
    );

    const day = screen.getByTestId('day');
    expect(day.textContent).toBe(date.format('ddd'));

    const conditionsIcon = screen.queryByTestId('conditions-icon');
    expect(conditionsIcon).not.toBeNull();
    expect(conditionsIcon).toBeVisible();

    expect(screen.getByTestId('next-day-forecast-item').classList).toContain(
      'selected',
    );
  });

  it('recieves callback on click', async () => {
    const weather: Weather = {
      icon: '2D',
      type: 'Clouds',
      description: 'a few clouds',
      temperature: 24.2345,
      temperature_max: 29.4554,
      temperature_min: 12.44564,
    };

    const date = moment();

    const onClick = jest.fn();

    render(
      <NextDayForecastItem
        {...weather}
        date={date}
        onClick={onClick}
        isSelected={true}
      />,
    );

    fireEvent.click(screen.getByTestId('next-day-forecast-item'));

    expect(onClick).toBeCalledTimes(1);
  });
});
