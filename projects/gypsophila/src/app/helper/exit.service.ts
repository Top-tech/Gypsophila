import { Injectable } from '@angular/core';
import { ShellService } from './shell/shell.service';


export declare type ExitOrigin = 'normal' | 'login' | null;

@Injectable({
    providedIn: 'root'
})
export class ExitService {
    private shellClient: any;

    constructor(shellService: ShellService) {
        this.shellClient = shellService.getTangrineClient();
    }

    exit(origin: ExitOrigin = 'normal') {
        // TODO: This can't close the tab not opened in '_blank' or open by script. Consider add some popup.
        // window.opener = null;
        // window.open('', '_self');
        // window.close();

        this.shellClient.exit();
    }
}
