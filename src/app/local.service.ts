import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

const API_KEY = 'f95a35cf371696bb0839bf8905b7e772';
const LANG = 'ru';
const STORAGE_KEY = 'list_cities';

export interface WeatherparamsAll {
  coord: {};
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
export interface Weatherparams {
  id: number;
  date: Date;
  name: string;
  temp: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  weather_icon: string;
  weather_description: string;
}

export interface Triggers {
  hum: boolean;
  alldata: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class LocalService {
  constructor(
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {}

  hasLocalData(): boolean {
    return this.storage.has(STORAGE_KEY);
  }
  getLocalData() {
    return this.storage.get(STORAGE_KEY);
  }

  pushLocalDate(data) {
    this.storage.set(STORAGE_KEY, data);
  }

  deleteLocalData() {
    this.storage.clear();
  }
  getCity(cityname: string) {
    return this.http.get<WeatherparamsAll>(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&lang=${LANG}`
    );
  }
}
