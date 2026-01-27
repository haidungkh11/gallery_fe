import {
    HTTP_INTERCEPTORS,
    HttpClient,
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi
} from '@angular/common/http';
import {ApplicationConfig, NgModule} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import {MessageService} from "primeng/api";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {getAppConfigProvider} from "@/pages/utils/app-config.token";
import {environment} from "./environments/environment";
import {AuthInterceptor} from "@/pages/service/AuthInterceptor";



export const appConfig: ApplicationConfig = {
    providers: [
        getAppConfigProvider(environment),
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(
            withFetch(),
            withInterceptorsFromDi()
        ),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        MessageService,
        DynamicDialogRef,
        DialogService,
        [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true
            }
        ]

    ]

};
