import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesktopRoutingModule } from './desktop-routing.module';
import { DesktopComponent } from './desktop.component';
import { GypButtonModule } from 'gypsophila-ui';


@NgModule({
    declarations: [DesktopComponent],
    imports: [
        CommonModule,
        DesktopRoutingModule,
        GypButtonModule
    ]
})
export class DesktopModule {
}
