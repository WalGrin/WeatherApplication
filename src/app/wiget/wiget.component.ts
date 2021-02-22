import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wiget',
  templateUrl: './wiget.component.html',
  styleUrls: ['./wiget.component.scss'],
})
export class WigetComponent {
  @Input() cities_names: string[];
  constructor() {}
}
