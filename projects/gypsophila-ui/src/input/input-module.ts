import { NgModule } from '@angular/core';
import { GypInput } from './input';
import { GypFormFiledModule } from '../form-field/form-field-modlue';

@NgModule({
    declarations: [GypInput],
    imports: [GypFormFiledModule],
    exports: [
        GypInput,
        GypFormFiledModule
    ],
    providers: [],
})
export class GypInputModule {
}


