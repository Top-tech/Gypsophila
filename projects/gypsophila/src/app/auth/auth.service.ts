import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor() {
    }

    private _isLoggedIn = false;

    get isLoggedIn() {
        return this._isLoggedIn;
    }
}
