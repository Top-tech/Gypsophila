import { Injectable, Input } from '@angular/core';
import { Tangerine, WindowWithExtension } from './shell.interface';

@Injectable({
    providedIn: 'root'
})
export class ShellService {

    constructor() {
    }

    // private getTangerineShell(): any {
    // 	return window.tangerineExtension;
    // }

    get TangerineClient(): Tangerine {
        // convert to unknown for non-overlapping
        return (window as unknown as WindowWithExtension).TangerineClient;
    }

    getTangerineClient2() {
        // if (!window.tangerineExtension && !window.tangerineExtension.TangerineClient) {
        //     console.error('No shell extension');
        //     return;
        // }
        // return new window.tangerineExtension.TangerineClient();
    }
}
