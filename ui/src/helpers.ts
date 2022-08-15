export const getApiUrl = (): string =>
  `${window.location.protocol}//${window.location.host}/api`;

export const roundUpTemperature = (temperature: number, digits: number = 1) =>
  parseFloat(temperature.toFixed(digits));
