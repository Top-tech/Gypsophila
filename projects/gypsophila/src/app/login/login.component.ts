import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'gyp-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    username: FormControl = new FormControl('');
    password: FormControl = new FormControl('');

    constructor() {
    }

    ngOnInit(): void {
    }

    login() {
        console.log('login');
    }
}
