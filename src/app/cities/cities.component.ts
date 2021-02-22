import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Weatherparams } from '../local.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent {
  @Input() subscribe_cities: Weatherparams[];

  constructor() {}

  @Output() childEventHumdity = new EventEmitter();
  checkHumdity(name) {
    this.childEventHumdity.emit(name);
  }

  @Output() childEventRemove = new EventEmitter();
  removeFollowCity(idx) {
    this.childEventRemove.emit(idx);
  }

  @Output() childEventAllParams = new EventEmitter();
  checkAllParams(name) {
    this.childEventAllParams.emit(name);
  }
}
