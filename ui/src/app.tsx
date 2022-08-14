import React from 'react';

import Container from 'react-bootstrap/Container';

import './app.scss';
import { WeatherCard } from './components/weather-card/weatherCard';

const App: React.FC = () => {
  return (
    <Container fluid>
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 text-center title">
          <h1>Weather Forecast</h1>
        </div>

        <WeatherCard />
      </div>
    </Container>
  );
};

export default App;
