import { Injectable } from '@angular/core';


export declare type ExitOrigin = 'normal' | 'login' | null;

@Injectable({
    providedIn: 'root'
})
export class ExitService {

    constructor() {
    }

    exit(origin: ExitOrigin = 'normal') {
        // TODO: This can't close the tab not opened in '_blank' or open by script. Consider add some popup.
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
}
