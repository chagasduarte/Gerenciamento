import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEcharts } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
              provideRouter(routes), 
              provideClientHydration(),
              provideHttpClient(withFetch()),
              provideToastr({timeOut: 5000,
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-bottom-right',
                preventDuplicates: true}),
              provideAnimations(),
              provideEcharts()
            ]
};
