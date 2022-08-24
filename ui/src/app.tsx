import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Container } from 'react-bootstrap';
import { WeatherCardContainer } from './components/weather-card-container/weatherCardContainer';

import './app.scss';
import 'react-toastify/dist/ReactToastify.css';

export class App extends React.Component {
  private showError(error: string) {
    toast(error, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  render() {
    return (
      <Container fluid>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 text-center title">
            <h1>Weather Forecast</h1>
          </div>

          <WeatherCardContainer onError={(error) => this.showError(error)} />
        </div>
        <ToastContainer />
      </Container>
    );
  }
}
