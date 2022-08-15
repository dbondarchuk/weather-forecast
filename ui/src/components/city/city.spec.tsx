import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import React from 'react';

import { City } from './city';

describe('City', () => {
  it('renders city name', () => {
    const { container } = render(
      <City
        city={{ name: 'Toronto', country: 'AB', id: 1 }}
        onChangeCity={() => {}}
      />,
    );

    expect(container.textContent).toBe('Toronto, AB');
  });

  it('changes to autocomplete', async () => {
    const { container } = render(
      <City
        city={{ name: 'Toronto', country: 'AB', id: 1 }}
        onChangeCity={() => {}}
      />,
    );

    fireEvent.click(screen.getByTestId('change-location-toggle'));
    await waitFor(() => {
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('Toronto, AB');
      expect(input).toBeVisible();

      expect(container.querySelector('.current-city')).toBeNull();
    });
  });
});
