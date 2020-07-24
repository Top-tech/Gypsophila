import { Injectable } from '@angular/core';
import { ShellService } from './shell/shell.service';
import { Tangerine } from './shell/shell.interface';
import { TangerineClient } from './shell/shell.decorator';


export declare type ExitOrigin = 'normal' | 'login' | null;

@Injectable({
    providedIn: 'root'
})
export class ExitService {
    @TangerineClient() client: Tangerine;

    constructor(private shellService: ShellService) {
    }

    exit(origin: ExitOrigin = 'normal') {
        this.shellService.TangerineClient.exit();
    }
}
