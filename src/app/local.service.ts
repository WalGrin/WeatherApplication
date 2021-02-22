import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_KEY = 'f95a35cf371696bb0839bf8905b7e772';
const LANG = 'ru';

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
  pre: boolean;
  ws: boolean;
  wdi: boolean;
  wi: boolean;
  wde: boolean;
  alldata: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class LocalService {
  constructor(private http: HttpClient) {}

  getCity(cityname: string) {
    return this.http.get<WeatherparamsAll>(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&lang=${LANG}`
    );
  }
}
