import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideEcharts } from 'ngx-echarts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpRequestInterceptor } from './shared/services/spinner.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
              provideRouter(routes), 
              provideClientHydration(),
              provideHttpClient(withInterceptorsFromDi(), withFetch()),
              {
                provide: HTTP_INTERCEPTORS,
                useClass:HttpRequestInterceptor,
                multi:true,
              },
              provideAnimations(),
              provideEcharts(),
              importProvidersFrom(
                BrowserModule,
                BrowserAnimationsModule,
                ToastrModule.forRoot({
                  timeOut: 500,
                  positionClass: 'toast-top-right',
                  preventDuplicates: true,
                }),
                NgxSpinnerModule.forRoot({})
              )
            ]
};
