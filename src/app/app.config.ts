import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, isDevMode, LOCALE_ID } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideEcharts } from 'ngx-echarts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpRequestInterceptor } from './shared/interceptors/spinner.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withHashLocation()),
  provideClientHydration(),
  provideHttpClient(withInterceptorsFromDi(), withFetch()),
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  provideAnimations(),
  provideEcharts(),
  importProvidersFrom(
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxSpinnerModule.forRoot({}),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately'
    }),
  ),
  { provide: LOCALE_ID, useValue: 'pt-BR' }

  ]
};
