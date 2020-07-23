import { Injectable } from '@angular/core';

declare var window;

@Injectable()
export class ShellService {

  constructor() { }

  // private getTangrineShell(): any {
	// 	return window.tangerineExtension;
  // }
  
  public getTangrineClient(): any {
		return window.TangerineClient;
  }
  
  // public getTangrineClient2() {
  //   try {
	// 		if (window.tangerineExtension && window.tangerineExtension.TangerineClient) {
	// 			return new window.tangerineExtension.TangerineClient();
	// 		}
	// 	} catch (error) {
	// 		return undefined;
	// 	}
  // }
}
