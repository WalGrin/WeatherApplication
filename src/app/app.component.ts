import {
  LocalService,
  Weatherparams,
  Triggers,
  WeatherparamsAll,
} from './local.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    '../app/font-awesome/css/font-awesome.min.css',
  ],
})
export class AppComponent {
  city_name: string = '';
  city_names: string[] = [];
  follow_cities: Weatherparams[] = [];
  triggers: Triggers = {
    hum: false,
    pre: false,
    ws: false,
    wdi: false,
    wi: false,
    wde: false,
    alldata: false,
  };

  constructor(public localservice: LocalService) {}

  addCityName() {
    console.log('Hello');
    if (!this.city_name.trim()) {
      return;
    }
    this.city_names.push(this.city_name);
    console.log('Отслеживаемые города', this.city_names);
    this.getCityWeather(this.city_name);
  }

  getCityWeather(cityname: string) {
    this.localservice.getCity(cityname).subscribe((response) => {
      console.log(response);
      const all_params_weather: WeatherparamsAll = response;
      this.city_name = '';
      if (this.triggers.hum) {
        this.updateHumidity(
          all_params_weather.main.humidity,
          all_params_weather.sys.id
        );
      } else {
        this.pushInFollowCities(all_params_weather);
      }
    });
  }

  pushInFollowCities(all_params_weather: WeatherparamsAll) {
    const city_weather: Weatherparams = {
      id: all_params_weather.sys.id,
      date: new Date(),
      name: all_params_weather.name,
      temp: all_params_weather.main.temp - 273,
      humidity: all_params_weather.main.humidity,
      pressure: all_params_weather.main.pressure,
      wind_speed: all_params_weather.wind.speed,
      wind_direction: all_params_weather.wind.deg,
      weather_icon: all_params_weather.weather[0].icon,
      weather_description: all_params_weather.weather[0].description,
    };
    if (this.triggers.alldata) {
      this.follow_cities.forEach((item, index) => {
        if (item.name == city_weather.name) {
          console.log('Изменение данных');
          this.follow_cities[index] = city_weather;
          console.log('Обновились данные');
        }
      });
      this.triggers.alldata = !this.triggers.alldata;
    } else {
      console.log(city_weather);
      this.follow_cities.push(city_weather);
      console.log(this.follow_cities);
    }
  }

  removeFollowCity(idx: number) {
    console.log(idx);
    this.follow_cities.splice(idx, 1);
    this.city_names.splice(idx, 1);
  }

  checkHumdity(name) {
    this.triggers.hum = !this.triggers.hum;
    this.getCityWeather(name);
  }

  checkAllParams(name) {
    this.triggers.alldata = !this.triggers.alldata;
    this.getCityWeather(name);
  }

  updateHumidity(hum: number, cityid: number) {
    this.follow_cities.forEach((item) => {
      if (item.id == cityid) {
        item.humidity = hum;
        console.log('Изменилось на входящее', item.humidity);
      }
    });
    this.triggers.hum = !this.triggers.hum;
  }
}
