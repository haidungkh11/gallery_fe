export interface AppConfig {
    production: boolean;

    protocol: string;

    host: string;

    path: string;

    oauthURL?: string;

    clientId?: string;

    appModule: string;

    serviceUrl: string;

    enableF12: boolean;
}
