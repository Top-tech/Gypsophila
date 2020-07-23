import { Injectable } from '@angular/core';
import { ShellService } from './shell/shell.service';


export declare type ExitOrigin = 'normal' | 'login' | null;

@Injectable({
    providedIn: 'root'
})
export class ExitService {

    constructor(private shellService: ShellService) {
    }

    exit(origin: ExitOrigin = 'normal') {
        this.shellService.TangerineClient.exit();
    }
}
