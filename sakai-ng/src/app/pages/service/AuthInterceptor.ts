import {Inject, Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {APP_CONFIG} from "@/pages/utils/app-config.token";
import {AppConfig} from "@/pages/utils/app.config";
import {MessageService} from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router,
                @Inject(APP_CONFIG) private appConfig: AppConfig,
                private messageService : MessageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        const authReq = token
            ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
            : req;

        return next.handle(authReq).pipe(
            catchError(err => {
                debugger;
                if (err.status === 401 || err.status === 403) {
                    localStorage.clear();
                    this.router.navigate(['']);
                }
                return throwError(() => this.processError(err));
            })
        );
    }


    private processError(error: HttpErrorResponse): Observable<never> {

        const status = error.status;

        // Ưu tiên message BE
        const backendMessage =
            error.error?.message ||
            error.error?.error ||
            error.message ||
            'Có lỗi xảy ra';

        // 🚀 BẮN TOAST
        this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: backendMessage,
            life: 4000
        });

        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            this.router.navigate(['']);
        }

        return throwError(() => error);
    }


}
