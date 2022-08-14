import moment from 'moment';
import React from 'react';
import {
  FORECAST_DATE_FORMAT,
  Weather,
} from '@weather-forecast/models';
import {
  NextDayForecastItem,
  NextDayForecastItemModel,
} from './nextDayForecastItem';
import { ForecastGroup } from '@weather-forecast/models';

export interface NextDaysForecastProperties {
  forecast: ForecastGroup;
  onSelectForecastDay: (date: moment.Moment) => void;
  selected?: moment.Moment;
}

export class NextDaysForecast extends React.Component<NextDaysForecastProperties> {
  getDayWeatherByPriority(weathers: Weather[]): Weather | undefined {
    // We should make a nice logic to find correct day weather type. i.e. if snow > rain > cloud > sunny

    if (!weathers || weathers.length === 0) return undefined;

    return weathers[Math.floor(weathers.length / 2)];
  }

  getForecast(): NextDayForecastItemModel[] {
    if (!this.props.forecast) return [];
    return Object.keys(this.props.forecast).map((key) => {
      const items = this.props.forecast[key];
      const weathers = Object.keys(items)
        .filter((k) => !isNaN(Number(k)))
        .map((k) => items[Number(k)] as Weather);
      const weather = this.getDayWeatherByPriority(weathers);
      return {
        date: moment(key, FORECAST_DATE_FORMAT),
        temperature: Math.max.apply(
          Math,
          weathers.map((w) => w.temperature_max),
        ),
        type: weather?.type ?? '',
        description: weather?.description ?? '',
        icon: weather?.icon.replace('n', 'd') ?? '',
      };
    });
  }

  render() {
    return (
      <div className="d-flex justify-content-between align-items-center mb-3 overflow-auto">
        {this.getForecast().map((item) => (
          <NextDayForecastItem
            {...item}
            onClick={this.props.onSelectForecastDay}
            isSelected={item.date.isSame(this.props.selected)}
            key={item.date.format(FORECAST_DATE_FORMAT)}
          />
        ))}
      </div>
    );
  }
}
