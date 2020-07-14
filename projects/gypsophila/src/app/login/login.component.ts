import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ExitService } from '../helper/exit.service';

@Component({
    selector: 'gyp-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    username: FormControl = new FormControl('', Validators.min(3));
    password: FormControl = new FormControl('');

    constructor(
        private exitService: ExitService
    ) {
    }

    ngOnInit(): void {
        this.username.valueChanges.subscribe(console.log);
    }

    login() {
        console.log('login');
    }

    exit() {
        this.exitService.exit('login');
    }
}
