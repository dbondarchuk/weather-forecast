import { render, screen, fireEvent } from '@testing-library/react';
import { ForecastGroup, FORECAST_DATE_FORMAT } from '@weather-forecast/models';
import moment from 'moment';
import React from 'react';

import { NextDaysForecast } from './nextDaysForecast';

describe('NextDaysForecast', () => {
  it('renders next day forecast correctly', async () => {
    const day1 = '10-10-2022';
    const day2 = '11-10-2022';
    const forecast: ForecastGroup = {
      [day1]: {
        1: {
          icon: '2D',
          type: 'Clouds',
          description: 'a few clouds',
          temperature: 24.2345,
          temperature_max: 29.4554,
          temperature_min: 12.44564,
        },
      },
      [day2]: {
        2: {
          icon: '2D',
          type: 'Sunny',
          description: 'no clouds',
          temperature: 25.7,
          temperature_max: 30.3,
          temperature_min: 11.1,
        },
      },
    };

    render(
      <NextDaysForecast
        selected={moment(day1, FORECAST_DATE_FORMAT)}
        forecast={forecast}
        onSelectForecastDay={() => {}}
      />,
    );

    const items = screen.queryAllByTestId('next-day-forecast-item');
    expect(items.length).toBe(2);

    expect(items[0].textContent).toContain(
      `${forecast[day1][1].temperature_max.toFixed(0)}°C`,
    );
    expect(items[1].textContent).toContain(
      `${forecast[day2][2].temperature_max.toFixed(0)}°C`,
    );

    expect(items[0].classList).toContain('selected');
  });

  it('on click on item fires event', async () => {
    const day1 = '10-10-2022';
    const day2 = '11-10-2022';
    const forecast: ForecastGroup = {
      [day1]: {
        1: {
          icon: '2D',
          type: 'Clouds',
          description: 'a few clouds',
          temperature: 24.2345,
          temperature_max: 29.4554,
          temperature_min: 12.44564,
        },
      },
      [day2]: {
        2: {
          icon: '2D',
          type: 'Sunny',
          description: 'no clouds',
          temperature: 25.7,
          temperature_max: 30.3,
          temperature_min: 11.1,
        },
      },
    };

    const onClick = jest.fn();

    render(
      <NextDaysForecast
        selected={moment(day1, FORECAST_DATE_FORMAT)}
        forecast={forecast}
        onSelectForecastDay={onClick}
      />,
    );

    const items = screen.queryAllByTestId('next-day-forecast-item');

    fireEvent.click(items[1]);

    expect(onClick).toBeCalledTimes(1);
  });
});
