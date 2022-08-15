import React from 'react';
import { Container } from 'react-bootstrap';
import { WeatherCardContainer } from './components/weather-card-container/weatherCardContainer';

import './app.scss';

export class App extends React.Component {
  render() {
    return (
      <Container fluid>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 text-center title">
            <h1>Weather Forecast</h1>
          </div>

          <WeatherCardContainer />
        </div>
      </Container>
    );
  }
}
