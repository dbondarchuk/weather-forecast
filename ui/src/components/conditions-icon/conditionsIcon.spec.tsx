import { render, screen } from '@testing-library/react';
import React from 'react';

import { ConditionsIcon } from './conditionsIcon';

describe('ConditionsIcon', () => {
  it('renders image correctly', async () => {
    const type = 'Clouds';
    const description = 'a few clouds';
    const icon = '2d';
    render(
      <ConditionsIcon icon={icon} type={type} description={description} />,
    );

    const img = screen.getByTestId('conditions-icon') as HTMLImageElement;
    expect(img.src).toBe(`http://openweathermap.org/img/wn/${icon}.png`);
    expect(img.title).toBe(`${type}, ${description}`);
    expect(img.alt).toBe(`${type}, ${description}`);
  });
});
