import {HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ApiCommonService {
    private requestId: string | null = null;

    public getHeaders(): HttpHeaders {
        if (!this.requestId) {
                this.requestId = this.generateRequestId();
            }
            return new HttpHeaders().set('RequestId', this.requestId);
    }
    private generateRequestId(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 12; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `ledung-${result}`;
    }
}
