import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideServerRendering } from '@angular/platform-server';

export function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      ...(appConfig.providers ?? []),
      provideServerRendering()
    ]
  },context);
}

export default bootstrap;