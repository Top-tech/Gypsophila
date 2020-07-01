import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExitService } from '../helper/exit.service';

@Component({
    selector: 'gyp-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    username: FormControl = new FormControl('');
    password: FormControl = new FormControl('');

    constructor(
        private exitService: ExitService
    ) {
    }

    ngOnInit(): void {
    }

    login() {
        console.log('login');
    }

    exit() {
        this.exitService.exit('login');
    }
}
