import { NgModule } from '@angular/core';

import { GypFormField } from './form-field';
import { GypLabel } from './label';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        GypFormField,
        GypLabel
    ],
    imports: [
        CommonModule
    ],
    exports: [
        GypFormField,
        GypLabel
    ],
    providers: [],
})
export class GypFormFiledModule {
}
