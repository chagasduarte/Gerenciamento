import { Injectable } from '@angular/core';

import appConfig from "../../../assets/appSetings.json";

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  get() {
    return appConfig.appConfig;
  }
}
