import {
  LocalService,
  Weatherparams,
  Triggers,
  WeatherparamsAll,
} from './local.service';
import { Component, OnInit } from '@angular/core';
import { StorigeService } from './storige.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    '../app/font-awesome/css/font-awesome.min.css',
  ],
})
export class AppComponent implements OnInit {
  mintempcity: string;
  maxtempcity: string;
  city_name: string = '';
  city_names: string[] = [];
  follow_cities: Weatherparams[] = [];
  triggers: Triggers = {
    hum: false,
    alldata: false,
  };

  constructor(
    public localservice: LocalService,
    private storigeService: StorigeService
  ) {}

  ngOnInit() {
    this.checkLocalData();
  }

  checkLocalData() {
    this.storigeService.storage.get('cities').subscribe((cities: string[]) => {
      console.log(cities);
      if (cities) {
        if (!this.localservice.hasLocalData()) {
          cities.forEach((item) => {
            this.city_names.push(item);
          });
          this.city_names.forEach((item) => {
            this.getCityWeather(item);
          });
        } else {
          cities.forEach((item) => {
            this.city_names.push(item);
          });
          this.localservice.getLocalData().forEach((item) => {
            this.follow_cities.push(item);
          });
          this.getMinMaxTemp();
        }
      }
    });
  }

  addCityName() {
    console.log('Hello');
    if (!this.city_name.trim()) {
      return;
    }
    if (this.city_names.includes(this.city_name)) {
      return;
    }
    this.city_names.push(this.city_name);
    this.storigeService.storage
      .set('cities', this.city_names)
      .subscribe(() => {});
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
      this.localservice.pushLocalDate(this.follow_cities);
      console.log(this.follow_cities);
    }
    this.getMinMaxTemp();
  }

  removeFollowCity(idx: number) {
    console.log(idx);
    this.follow_cities.splice(idx, 1);
    this.city_names.splice(idx, 1);
    this.storigeService.storage.delete('cities').subscribe(() => {});
    this.storigeService.storage
      .set('cities', this.city_names)
      .subscribe(() => {});
    this.localservice.pushLocalDate(this.follow_cities);
    this.getMinMaxTemp();
  }

  checkHumdity(name: string) {
    this.triggers.hum = !this.triggers.hum;
    this.getCityWeather(name);
  }

  checkAllParams(name: string) {
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

  getMinMaxTemp() {
    if (this.follow_cities.length == 0) {
      return;
    } else {
      const temparr: number[] = [];
      this.follow_cities.forEach((item) => {
        temparr.push(item.temp);
      });
      let maxtemp = Math.max.apply(null, temparr);
      let mintemp = Math.min.apply(null, temparr);
      this.follow_cities.forEach((item) => {
        if (item.temp == maxtemp) {
          this.maxtempcity = item.name;
        }
        if (item.temp == mintemp) {
          this.mintempcity = item.name;
        }
      });
    }
  }
}
