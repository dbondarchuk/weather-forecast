import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { City } from '@weather-forecast/models';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { Autocomplete } from './autocomplete';

describe('Autocomplete', () => {
  it('renders suggestions correctly', async () => {
    const url = 'http://example.com?q=';

    const cities: City[] = [];
    const cityName = 'Toronto';
    const country = 'CA';
    for (let i = 0; i < 20; i++) {
      cities.push({
        name: cityName + i,
        country: country,
        id: i,
      });
    }

    const newText = 'To';

    const fetchSpy = jest.spyOn(global, 'fetch');
    // @ts-expect-error Tests
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(cities),
        ok: true,
      }),
    );

    const displayFunc = (city: City) => `${city.name}, ${city.country}`;

    render(
      <Autocomplete<City>
        url={url}
        displayFunc={displayFunc}
        keyFunc={(city) => city.id.toString()}
        onSelect={(city) => {}}
        value={cities[0]}
      />,
    );

    const input = screen.getByTestId('autocomplete-input') as HTMLInputElement;

    expect(input.value).toBe(displayFunc(cities[0]));

    await act(async () => {
      fireEvent.change(input, { target: { value: newText } });

      await waitFor(() => {
        expect(fetchSpy).toBeCalledTimes(1);
        expect(fetchSpy).toBeCalledWith(`${url}${newText}`);
      });
    });

    const suggestions = (
      await screen.findByTestId('suggestions')
    ).querySelectorAll('li');
    expect(suggestions.length).toBe(10);

    suggestions.forEach((element, index) => {
      expect(element.textContent).toBe(`${cityName}${index}, ${country}`);
    });
  });

  it('renders no suggestions when no results', async () => {
    const url = 'http://example.com?q=';

    const newText = 'To';

    const fetchSpy = jest.spyOn(global, 'fetch');
    // @ts-expect-error Tests
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
        ok: true,
      }),
    );

    const displayFunc = (city: City) => `${city.name}, ${city.country}`;

    const { container } = render(
      <Autocomplete<City>
        url={url}
        displayFunc={displayFunc}
        keyFunc={(city) => city.id.toString()}
        onSelect={(city) => {}}
      />,
    );

    const input = screen.getByTestId('autocomplete-input') as HTMLInputElement;

    expect(input.value).toBe('');

    await act(async () => {
      fireEvent.change(input, { target: { value: newText } });

      await waitFor(() => {
        expect(fetchSpy).toBeCalledTimes(1);
        expect(fetchSpy).toBeCalledWith(`${url}${newText}`);
      });
    });

    await screen.findByTestId('no-suggestions');
  });

  it('on select fires callback', async () => {
    const url = 'http://example.com?q=';

    const cities: City[] = [];
    const cityName = 'Toronto';
    const country = 'CA';
    for (let i = 0; i < 5; i++) {
      cities.push({
        name: cityName + i,
        country: country,
        id: i,
      });
    }

    const newText = 'To';

    const fetchSpy = jest.spyOn(global, 'fetch');
    // @ts-expect-error Tests
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(cities),
        ok: true,
      }),
    );

    const displayFunc = (city: City) => `${city.name}, ${city.country}`;
    const onSelect = jest.fn<City, any>();

    const { container } = render(
      <Autocomplete<City>
        url={url}
        displayFunc={displayFunc}
        keyFunc={(city) => city.id.toString()}
        onSelect={onSelect}
        value={cities[0]}
      />,
    );

    const input = screen.getByTestId('autocomplete-input') as HTMLInputElement;

    expect(input.value).toBe(displayFunc(cities[0]));

    await act(async () => {
      fireEvent.change(input, { target: { value: newText } });

      await waitFor(() => {
        expect(fetchSpy).toBeCalledTimes(1);
        expect(fetchSpy).toBeCalledWith(`${url}${newText}`);
      });
    });

    const suggestions = (
      await screen.findByTestId('suggestions')
    ).querySelectorAll('li');

    fireEvent.click(suggestions[1]);

    expect(onSelect).toBeCalledTimes(1);
    expect(onSelect).toBeCalledWith(cities[1]);
  });

  it('keys events are handled properly', async () => {
    const url = 'http://example.com?q=';

    const cities: City[] = [];
    const cityName = 'Toronto';
    const country = 'CA';
    for (let i = 0; i < 5; i++) {
      cities.push({
        name: cityName + i,
        country: country,
        id: i,
      });
    }

    const newText = 'To';

    const fetchSpy = jest.spyOn(global, 'fetch');
    // @ts-expect-error Tests
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(cities),
        ok: true,
      }),
    );

    const displayFunc = (city: City) => `${city.name}, ${city.country}`;
    const onSelect = jest.fn<City, any>();

    const { container } = render(
      <Autocomplete<City>
        url={url}
        displayFunc={displayFunc}
        keyFunc={(city) => city.id.toString()}
        onSelect={onSelect}
        value={cities[0]}
      />,
    );

    const input = screen.getByTestId('autocomplete-input') as HTMLInputElement;

    expect(input.value).toBe(displayFunc(cities[0]));

    await act(async () => {
      fireEvent.change(input, { target: { value: newText } });

      await waitFor(() => {
        expect(fetchSpy).toBeCalledTimes(1);
        expect(fetchSpy).toBeCalledWith(`${url}${newText}`);
      });
    });

    const suggestions = (
      await screen.findByTestId('suggestions')
    ).querySelectorAll('li');

    act(() => {
      fireEvent.keyDown(input, { keyCode: 40 });
    });

    expect(suggestions[0].className).not.toContain('suggestion-active');
    expect(suggestions[1].className).toContain('suggestion-active');

    act(() => {
      fireEvent.keyDown(input, { keyCode: 40 });
    });

    expect(suggestions[1].className).not.toContain('suggestion-active');
    expect(suggestions[2].className).toContain('suggestion-active');

    act(() => {
      fireEvent.keyDown(input, { keyCode: 38 });
    });

    expect(suggestions[2].className).not.toContain('suggestion-active');
    expect(suggestions[1].className).toContain('suggestion-active');

    act(() => {
      fireEvent.keyDown(input, { keyCode: 13 });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('suggestions')).toBeNull();
    });

    expect(onSelect).toBeCalledTimes(1);
    expect(onSelect).toBeCalledWith(cities[1]);

    expect(input.value).toBe(displayFunc(cities[1]));

    await act(async () => {
      fireEvent.change(input, { target: { value: newText } });

      await waitFor(() => {
        expect(fetchSpy).toBeCalledTimes(2);
        expect(fetchSpy).toBeCalledWith(`${url}${newText}`);
      });
    });

    await screen.findByTestId('suggestions');

    act(() => {
      fireEvent.keyDown(input, { keyCode: 27 });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('suggestions')).toBeNull();
    });
  });
});
