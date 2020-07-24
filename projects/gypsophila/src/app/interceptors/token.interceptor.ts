import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor() {
    }

    static addToken(request: HttpRequest<unknown>) {
        request.headers.set('token', 'test-token');
        return request;
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.headers.get('no-identity')) {
            request.headers.delete('no-identity');
            return next.handle(request);
        }
        return next.handle(TokenInterceptor.addToken(request));
    }
}
