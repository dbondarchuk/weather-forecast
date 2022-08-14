import moment from 'moment';
import React from 'react';

import './clock.scss';

interface ClockState {
  date: moment.Moment;
}

export interface ClockProperties {
  timezone: number;
}

export class Clock extends React.Component<ClockProperties, ClockState> {
  private updateInterval: string | number | NodeJS.Timer | undefined;
  constructor(props: ClockProperties) {
    super(props);

    this.state = {
      date: moment().utcOffset(this.props.timezone),
    };
  }

  componentDidMount() {
    this.updateInterval = setInterval(
      () => this.setState({ date: moment().utcOffset(this.props.timezone) }),
      500,
    );
  }

  componentWillUnmount() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  }

  render() {
    return (
      <div className="small">
        {this.state.date.get('hours').toString().padStart(2, '0')}
        <span className="blink">:</span>
        {this.state.date.get('minutes').toString().padStart(2, '0')}
      </div>
    );
  }
}
