import moment from 'moment';
import React from 'react';
import { ConditionsIcon } from '../conditions-icon/conditionsIcon';

import './nextDayForecastItem.scss';

export interface NextDayForecastItemModel {
  date: moment.Moment;
  temperature: number;
  icon: string;
  type: string;
  description: string;
}

export type NextDayForecastItemProperties = NextDayForecastItemModel & {
  onClick: (date: moment.Moment) => void;
  isSelected: boolean;
};

export class NextDayForecastItem extends React.Component<NextDayForecastItemProperties> {
  render() {
    return (
      <div
        className={
          'flex-column border next-day-item' +
          (this.props.isSelected ? ' selected' : '')
        }
        onClick={() => this.props.onClick(this.props.date)}
        data-testid="next-day-forecast-item"
      >
        <p className="small mb-1" data-testid="day">
          {this.props.date.format('ddd')}
        </p>
        <p className="small mb-1">
          <ConditionsIcon
            icon={this.props.icon}
            type={this.props.type}
            description={this.props.description}
          />
        </p>
        <p className="small mb-0" data-testid="temperature">
          <strong>{this.props.temperature.toFixed(0)}°C</strong>
        </p>
      </div>
    );
  }
}
