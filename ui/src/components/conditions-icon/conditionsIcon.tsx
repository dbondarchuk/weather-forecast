import React from 'react';

export interface ConditionsIconProperties {
  icon: string;
  type: string;
  description: string;
}

export class ConditionsIcon extends React.Component<ConditionsIconProperties> {
  render() {
    const description = this.props.type + ', ' + this.props.description;
    return (
      <img
        src={'http://openweathermap.org/img/wn/' + this.props.icon + '.png'}
        alt={description}
        title={description}
        data-testid="conditions-icon"
      />
    );
  }
}
