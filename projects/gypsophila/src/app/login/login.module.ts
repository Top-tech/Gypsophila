import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GypButtonModule, GypInputModule } from 'gypsophila-ui';
import { ShellModule } from '../helper/shell/shell.module';


@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GypButtonModule,
        GypInputModule,
        ShellModule,
    ]
})
export class LoginModule {
}
