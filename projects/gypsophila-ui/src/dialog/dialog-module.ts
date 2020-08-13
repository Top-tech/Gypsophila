import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { GypDialogContainer } from './dialog-container';
import { GypDialog } from './dialog';

@NgModule({
    imports: [
        OverlayModule,
        PortalModule,
    ],
    exports: [
        GypDialogContainer
    ],
    declarations: [
        GypDialogContainer
    ],
    providers: [
        GypDialog
    ],
    entryComponents: [
        GypDialogContainer
    ]
})
export class DialogModule {
}
