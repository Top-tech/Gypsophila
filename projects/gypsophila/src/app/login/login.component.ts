import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExitService } from '../helper/exit.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'gyp-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginGroup: FormGroup = new FormGroup({
        username: new FormControl('', Validators.min(3)),
        password: new FormControl('')
    });

    constructor(
        private authService: AuthService,
        private exitService: ExitService
    ) {
    }

    ngOnInit(): void {
    }

    login() {
        this.authService.login(this.loginGroup.value)
            .subscribe(console.log);
    }

    exit() {
        this.exitService.exit('login');
    }
}
