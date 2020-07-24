import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private http: HttpClient
    ) {
    }

    private _isLoggedIn = false;

    get isLoggedIn() {
        return this._isLoggedIn;
    }

    login(data) {
        const headers = new HttpHeaders().set('no-identity', 'true');
        return this.http.post('login', data, {headers});
    }
}
