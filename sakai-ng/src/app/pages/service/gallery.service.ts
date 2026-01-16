import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, Observable, retryWhen, tap, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfig} from "@/pages/utils/app.config";
import {APP_CONFIG} from "@/pages/utils/app-config.token";
import {ApiCommonService} from "@/pages/service/api-common.service";


@Injectable({
    providedIn: 'root'
})
export class GalleryService {
    // private csrfToken: string | undefined;
    private url: string;

    constructor(private router: Router, private httpClient: HttpClient, @Inject(APP_CONFIG) appConfig: AppConfig,  private apiCommonService: ApiCommonService) {
        this.url = appConfig.protocol + "://" + appConfig.host + appConfig.path;
        console.log(this.url);
    }

    // private retrieveCsrfToken(): void {
    //     // Retrieve CSRF token from cookie
    //     this.csrfToken = this.getCookie('XSRF-TOKEN');
    // }

    private getHeaders(): HttpHeaders {
        // Construct headers with CSRF token
        let headers = new HttpHeaders();
        // if (this.csrfToken) {
        //     headers = headers.set('X-XSRF-TOKEN', this.csrfToken);
        // } else {
        //     this.retrieveCsrfToken();
        //     headers = headers.set('X-XSRF-TOKEN', this.csrfToken);
        // }
        headers = headers.set('RequestId', "assetCustomer_" + crypto.randomUUID());
        return headers;
    }

    private getCookie(name: string): string {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : '';
    }

    update(data: any, action:string): Observable<any> {
        return this.httpClient.post(this.url + 'web/vgj/customer/update/' + action, data, {
            headers: this.apiCommonService.getHeaders(),
            withCredentials: true,
            observe: 'events',
            responseType: 'json',
        }).pipe(
            tap(data => data),
            catchError(this.handleError));
    }
    getList(): Observable<any> {
        return this.httpClient.get(this.url + '/api/ledung/gallery/findRootItem', {
            headers: this.apiCommonService.getHeaders(),
            withCredentials: true,
            observe: 'events',
            responseType: 'json',
        }).pipe(
            tap(data => data),
            catchError(this.handleError));
    }

    fetch(data: any): Observable<any> {
        return this.httpClient.post(this.url + '/api/ledung/gallery/findChildrenItem', data, {
            headers: this.apiCommonService.getHeaders(),
            withCredentials: true,
            observe: 'events',
            responseType: 'json',
        }).pipe(
            tap(data => data),
            catchError(this.handleError));
    }

    fetchFinal(data: any): Observable<any> {
        return this.httpClient.post(this.url + 'web/vgj/asset-customer/find-final', data, {
            headers: this.apiCommonService.getHeaders(),
            withCredentials: true,
            observe: 'events',
            responseType: 'json',
        }).pipe(
            tap(data => data),
            catchError(this.handleError));
    }

    fetchHis(data: any): Observable<any> {
        return this.httpClient.post(this.url + 'web/vgj/customer/find-his', data, {
            headers: this.apiCommonService.getHeaders(),
            withCredentials: true,
            observe: 'events',
            responseType: 'json',
        }).pipe(
            tap(data => data),
            catchError(this.handleError));
    }

    save(data: any): Observable<any> {
        return this.httpClient.post(this.url + '/api/ledung/gallery/createFolder', data, {
            headers: this.apiCommonService.getHeaders(),
            withCredentials: true,
            observe: 'events',
            responseType: 'json',
        }).pipe(
            tap(data => data),
            catchError(this.handleError));
    }
    uploadFile(data: FormData, parentId: number): Observable<any> {
        let headers = this.apiCommonService.getHeaders();
        headers = headers.set('ParentId', parentId.toString());

        return this.httpClient.post(
            this.url + '/api/ledung/gallery/uploadFile',
            data,
            {
                headers: headers,
                withCredentials: true,
                observe: 'events',
                responseType: 'json'
            }
        ).pipe(
            catchError(this.handleError)
        );
    }
    deleteItem(data: any): Observable<any> {
        return this.httpClient.post(this.url + '/api/ledung/gallery/deleteItem', data, {
            headers: this.apiCommonService.getHeaders(),
            withCredentials: true,
            observe: 'events',
            responseType: 'json',
        }).pipe(
            tap(data => data),
            catchError(this.handleError));
    }


    private handleError(err: HttpErrorResponse): Observable<never> {
        // just a test ... more could would go here
        return throwError(() => err.error);
    }



}
