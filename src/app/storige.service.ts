import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable()
export class StorigeService {
  constructor(public storage: StorageMap) {}
}
