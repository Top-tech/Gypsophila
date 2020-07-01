import { Directive, Optional, Self } from '@angular/core';
import { CanUpdateErrorStateCtor, ErrorStateMatcher } from '@angular/material/core';
import { FormGroupDirective, NgControl } from '@angular/forms';
import { mixinErrorState } from '../core/common-behaviors/error-state';


class GypInputBase {
    constructor(
        public _defaultErrorStateMatcher: ErrorStateMatcher,
        public _parentFormGroup: FormGroupDirective,
        public ngControl: NgControl
    ) {}
}
const _GypInputMixinBase: CanUpdateErrorStateCtor & typeof GypInputBase =
    mixinErrorState(GypInputBase);



@Directive({
    selector: 'input[gyp-input]',
    exportAs: 'gypInput'
})
export class GypInput extends _GypInputMixinBase {
    constructor(
        _defaultErrorStateMatcher: ErrorStateMatcher,
        _parentFormGroup: FormGroupDirective,
        @Optional() @Self() public ngControl: NgControl,
    ) {
        super(_defaultErrorStateMatcher, _parentFormGroup, ngControl);
    }
}
