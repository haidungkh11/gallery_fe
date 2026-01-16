import {HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ApiCommonService {
    private requestId: string | null = null;

    public getHeaders(): HttpHeaders {
        if (!this.requestId) {
            this.requestId = `ledung-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
        }
        return new HttpHeaders().set('RequestId', this.requestId);
    }
}
