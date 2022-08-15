# Weather Forecast app / React widget

## About

This is a monorepo for the Weather Forecast app / React component

![Example of app](./weather-forecast.png)

Example: [https://dbondarchuk-weather-forecast.herokuapp.com/](https://dbondarchuk-weather-forecast.herokuapp.com/)

### Main features:

- Responsive design
- City selection with autocomplete (with locally stored database)
- Adjusting times and dates to the city timezone
- Clock
- Dynamic background based on the selected city
- Current conditions
- Forecast for the next few days with hourly conditions for each day
- Getting data from OpenWeather Map API

## Installation

- Manual way:

  1. Clone this repo
  2. Run `make init`
  3. Run `make start`

- Semi-automatic way:

  1. Clone this repo
  2. Run `make docker`

- Automatic way:

  1. Run `docker run -p:3001:3001 dbondarchuk/weather-forecast:latest`

## Usage

1. Open browser at `http://localhost:3001`
2. Click on `location` button right to the city name
3. Select your city
4. Click on next days to check hourly forecast for that day

## Development

This mono-repo uses `yarn` [workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). Please [install](https://classic.yarnpkg.com/en/docs/install) `yarn` if you don't have it.

There are some shortcuts in `Makefile` in root directory. If your system doesn't support `make` command, please look inside of the `Makefile` or `package.json` in the root directory.

PRs are welcomed and are required to publish your changes. Please run `make format` before the commit

Please create issues on the Github

## Testing

You can run `make test` to launch tests in both `api` and `ui` projects
