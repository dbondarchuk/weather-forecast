import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import moment from 'moment';
import React from 'react';

import { Clock } from './clock';

describe('Clock', () => {
  it('renders time with timezone correctly', async () => {
    const timezone = -240;
    const { container } = render(<Clock timezone={timezone} />);

    const expectedTime = moment().utcOffset(timezone).format('HH:mm');
    expect(container.textContent).toBe(expectedTime);
  });
});
