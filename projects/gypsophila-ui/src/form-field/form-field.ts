import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, ContentChild,
    ElementRef,
    InjectionToken,
    OnDestroy, ViewChild, ViewEncapsulation
} from '@angular/core';
import { CanColor, CanColorCtor, mixinColor } from '../core/common-behaviors/color';
import { GypFormFieldControl } from './form-field-control';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { getGypFormFieldMissingControlError } from './form-field-errors';
import { startWith } from 'rxjs/operators';
import { GypLabel } from './label';


class GypFormFieldBase {
    constructor(public _elementRef: ElementRef) {
    }
}

const _GypFormFieldMixinBase: CanColorCtor & typeof GypFormFieldBase =
    mixinColor(GypFormFieldBase, 'primary');

export const GYP_FORM_FIELD = new InjectionToken<GypFormField>('GypFormField');

@Component({
    selector: 'gyp-form-field',
    exportAs: 'gypFormField',
    templateUrl: 'form-field.html',
    styleUrls: ['./form-field.scss'],
    // animations: [gypFormFieldAnimations.transitionMessages],
    host: {
        'class': 'gyp-form-field',
        '[class.gyp-form-field-invalid]': '_control.errorState',
        '[class.gyp-form-field-disabled]': '_control.disabled',
        '[class.gyp-form-field-autofilled]': '_control.autofilled',
        '[class.gyp-focused]': '_control.focused',
        '[class.gyp-accent]': 'color == "accent"',
        '[class.gyp-warn]': 'color == "warn"',
        '[class.ng-untouched]': '_shouldForward("untouched")',
        '[class.ng-touched]': '_shouldForward("touched")',
        '[class.ng-pristine]': '_shouldForward("pristine")',
        '[class.ng-dirty]': '_shouldForward("dirty")',
        '[class.ng-valid]': '_shouldForward("valid")',
        '[class.ng-invalid]': '_shouldForward("invalid")',
        '[class.ng-pending]': '_shouldForward("pending")',
        // '[class._gyp-animation-noopable]': '!_animationsEnabled',
    },
    inputs: ['color'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {provide: GYP_FORM_FIELD, useExisting: GypFormField}
    ]
})
export class GypFormField extends _GypFormFieldMixinBase
    implements AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy, CanColor {

    @ViewChild('connectionContainer', {static: true}) _connectionContainerRef: ElementRef;
    @ViewChild('inputContainer') _inputContainerRef: ElementRef;

    @ContentChild(GypFormFieldControl) _controlNonStatic: GypFormFieldControl<any>;
    @ContentChild(GypFormFieldControl, {static: true}) _controlStatic: GypFormFieldControl<any>;
    get _control() {
        return this._explicitFormFieldControl || this._controlNonStatic || this._controlStatic;
    }
    set _control(value) {
        this._explicitFormFieldControl = value;
    }
    private _explicitFormFieldControl: GypFormFieldControl<any>;

    @ContentChild(GypLabel) _labelChildNonStatic: GypLabel;
    @ContentChild(GypLabel, {static: true}) _labelChildStatic: GypLabel;
    get labelChild() {
        return this._labelChildNonStatic || this._labelChildStatic;
    }

    private _destroyed = new Subject<void>();

    constructor(
        public _elementRef: ElementRef,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        super(_elementRef);
    }

    ngAfterContentChecked(): void {
        this._validateControlChild();
    }

    ngAfterContentInit(): void {
        this._validateControlChild();

        const control = this._control;

        // Subscribe to changes in the child control state in order to update the form field UI.
        control.stateChanges.pipe(startWith(null!)).subscribe(() => {
            this._changeDetectorRef.markForCheck();
        });
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    /** Determines whether a class from the NgControl should be forwarded to the host element. */
    _shouldForward(prop: keyof NgControl): boolean {
        const ngControl = this._control ? this._control.ngControl : null;
        return ngControl && ngControl[prop];
    }

    /** Throws an error if the form field's control is missing. */
    protected _validateControlChild() {
        if (!this._control) {
            throw getGypFormFieldMissingControlError();
        }
    }

    hasLabel() {
        return !!this.labelChild;
    }
}
