import { Injectable } from '@nestjs/common';
import { City } from '@weather-forecast/models';

import * as cities from '../data/city.list.min.json';

@Injectable()
export class CityList {
  getCities(): City[] {
    return cities as City[];
  }
}
