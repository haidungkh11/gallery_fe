import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import {environment} from "./environments/environment";

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
console.log('Environment đang dùng:', environment);
console.log('Production mode?', environment.production);
console.log('Service URL:', environment.serviceUrl);
