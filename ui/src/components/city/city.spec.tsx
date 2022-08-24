import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import React from 'react';

import { City } from './city';

describe('City', () => {
  it('renders city name', () => {
    const { container } = render(
      <City
        city={{ name: 'Toronto', country: 'AB', id: 1 }}
        onLocateMeRequest={() => {}}
        onChangeCity={() => {}}
      />,
    );

    expect(container.textContent).toBe('Toronto, AB');
  });

  it('changes to autocomplete', async () => {
    const { container } = render(
      <City
        city={{ name: 'Toronto', country: 'AB', id: 1 }}
        onLocateMeRequest={() => {}}
        onChangeCity={() => {}}
      />,
    );

    fireEvent.click(screen.getByTestId('current-city'));
    await waitFor(() => {
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('Toronto, AB');
      expect(input).toBeVisible();

      expect(container.querySelector('.current-city')).toBeNull();
    });
  });

  it('fires onLocateMe on location icon click', async () => {
    const locateMeFn = jest.fn();
    render(
      <City
        city={{ name: 'Toronto', country: 'AB', id: 1 }}
        onLocateMeRequest={locateMeFn}
        onChangeCity={() => {}}
      />,
    );

    fireEvent.click(screen.getByTestId('locate-me'));
    await waitFor(() => {
      expect(locateMeFn).toBeCalledTimes(1);
    });
  });
});
