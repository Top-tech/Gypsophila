import { AfterViewInit, Directive, DoCheck, ElementRef,
    Inject, Input, NgZone, OnChanges, OnDestroy, Optional, Self } from '@angular/core';
import { CanUpdateErrorStateCtor, ErrorStateMatcher } from '@angular/material/core';
import { FormGroupDirective, NgControl } from '@angular/forms';
import { CanUpdateErrorState, mixinErrorState } from '../core/common-behaviors/error-state';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { GYP_INPUT_VALUE_ACCESSOR } from './input-value-accessor';
import { getGypInputUnsupportedTypeError } from './input-errors';

const GYP_INPUT_INVALID_TYPES = [
    'button',
    'checkbox',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit'
];

class GypInputBase {
    constructor(
        public _defaultErrorStateMatcher: ErrorStateMatcher,
        public _parentFormGroup: FormGroupDirective,
        public ngControl: NgControl
    ) {}
}
const _GypInputMixinBase: CanUpdateErrorStateCtor & typeof GypInputBase =
    mixinErrorState(GypInputBase);

let nextUniqueId = 0;

@Directive({
    selector: 'input[gyp-input], textarea[gyp-input]',
    exportAs: 'gypInput',
    host: {
        '[attr.id]': 'id',
        '[attr.placeholder]': 'placeholder',
        '[disabled]': 'disabled',
        '[required]': 'required',
        '[attr.readonly]': 'readonly || null',
        '[attr.aria-describedby]': '_ariaDescribedby || null',
        '[attr.aria-invalid]': 'errorState',
        '[attr.aria-required]': 'required.toString()',
        '(focus)': '_focusChanged(true)',
        '(blur)': '_focusChanged(false)',
        '(input)': '_onInput()'
    }
})
export class GypInput extends _GypInputMixinBase implements OnChanges,
    OnDestroy, AfterViewInit, DoCheck, CanUpdateErrorState {
    protected _uid = `gyp-input-${nextUniqueId++}`;
    protected _previousNativeValue: any;
    private _inputValueAccessor: {value: any};
    /** The aria-describedby attribute on the input for improved a11y. */
    _ariaDescribedby: string;
    private _isServer: boolean;
    private _isTextarea: boolean;

    @Input()
    get id(): string { return this._id; }
    set id(value: string) { this._id = value || this._uid; }
    protected _id: string;

    @Input() placeholder: string;

    @Input()
    get required(): boolean { return this._required; }
    set required(value: boolean) { this._required = coerceBooleanProperty(value); }
    protected _required = false;

    /** Input type of the element. */
    // @Input()
    // get type(): string { return this._type; }
    // set type(value: string) {
    //     this._type = value || 'text';
    //     this._validateType();
    //
    //     // When using Angular inputs, developers are no longer able to set the properties on the native
    //     // input element. To ensure that bindings for `type` work, we need to sync the setter
    //     // with the native property. Textarea elements don't support the type property or attribute.
    //     if (!this._isTextarea && getSupportedInputTypes().has(this._type)) {
    //         (this._elementRef.nativeElement as HTMLInputElement).type = this._type;
    //     }
    // }
    protected _type = 'text';

    @Input()
    get disabled(): boolean {
        if (this.ngControl && this.ngControl.disabled !== null) {
            return this.ngControl.disabled;
        }
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);

        // Browsers may not fire the blur event if the input is disabled too quickly.
        // Reset from here to ensure that the element doesn't become stuck.
        if (this.focused) {
            this.focused = false;
            this.stateChanges.next();
        }
    }
    protected _disabled = false;

    focused: boolean = false;

    @Input()
    get readonly(): boolean { return this._readonly; }
    set readonly(value: boolean) { this._readonly = coerceBooleanProperty(value); }
    private _readonly = false;

    autofilled = false;

    @Input()
    get value(): string { return this._inputValueAccessor.value; }
    set value(value: string) {
        if (value !== this.value) {
            this._inputValueAccessor.value = value;
            this.stateChanges.next();
        }
    }

    protected _neverEmptyInputTypes = [
        'date',
        'datetime',
        'datetime-local',
        'month',
        'time',
        'week'
    ].filter(t => getSupportedInputTypes().has(t));

    constructor(
        protected _elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
        protected _platform: Platform,
        _defaultErrorStateMatcher: ErrorStateMatcher,
        _parentFormGroup: FormGroupDirective,
        @Optional() @Self() public ngControl: NgControl,
        @Optional() @Self() @Inject(GYP_INPUT_VALUE_ACCESSOR) inputValueAccessor: any,
        private _autofillMonitor: AutofillMonitor,
        ngZone: NgZone
    ) {
        super(_defaultErrorStateMatcher, _parentFormGroup, ngControl);

        const element = this._elementRef.nativeElement;
        const nodeName = element.nodeName.toLowerCase();

        // If no input value accessor was explicitly specified, use the element as the input value
        // accessor.
        this._inputValueAccessor = inputValueAccessor || element;

        this._previousNativeValue = this.value;

        // Force setter to be called in case id was not specified.
        this.id = this.id;

        // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
        // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
        // exists on iOS, we only bother to install the listener on iOS.
        if (_platform.IOS) {
            ngZone.runOutsideAngular(() => {
                _elementRef.nativeElement.addEventListener('keyup', (event: Event) => {
                    let el = event.target as HTMLInputElement;
                    if (!el.value && !el.selectionStart && !el.selectionEnd) {
                        // Note: Just setting `0, 0` doesn't fix the issue. Setting
                        // `1, 1` fixes it for the first time that you type text and
                        // then hold delete. Toggling to `1, 1` and then back to
                        // `0, 0` seems to completely fix it.
                        el.setSelectionRange(1, 1);
                        el.setSelectionRange(0, 0);
                    }
                });
            });
        }

        this._isServer = !this._platform.isBrowser;
        this._isTextarea = nodeName === 'textarea';
    }

    ngAfterViewInit() {
        if (this._platform.isBrowser) {
            this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(event => {
                this.autofilled = event.isAutofilled;
                this.stateChanges.next();
            });
        }
    }

    ngOnChanges() {
        this.stateChanges.next();
    }

    ngOnDestroy() {
        this.stateChanges.complete();

        if (this._platform.isBrowser) {
            this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
        }
    }

    ngDoCheck() {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this.updateErrorState();
        }

        // We need to dirty-check the native element's value, because there are some cases where
        // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
        // updating the value using `emitEvent: false`).
        this._dirtyCheckNativeValue();
    }

    /** Focuses the input. */
    focus(options?: FocusOptions): void {
        this._elementRef.nativeElement.focus(options);
    }

    _focusChanged(isFocused: boolean) {
        if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
            this.focused = isFocused;
            this.stateChanges.next();
        }
    }

    _onInput() {
        // This is a noop function and is used to let Angular know whenever the value changes.
        // Angular will run a new change detection each time the `input` event has been dispatched.
        // It's necessary that Angular recognizes the value change, because when floatingLabel
        // is set to false and Angular forms aren't used, the placeholder won't recognize the
        // value changes and will not disappear.
        // Listening to the input event wouldn't be necessary when the input is using the
        // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
    }

    /** Does some manual dirty checking on the native input `value` property. */
    protected _dirtyCheckNativeValue() {
        const newValue = this._elementRef.nativeElement.value;

        if (this._previousNativeValue !== newValue) {
            this._previousNativeValue = newValue;
            this.stateChanges.next();
        }
    }

    /** Make sure the input is a supported type. */
    protected _validateType() {
        if (GYP_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
            throw getGypInputUnsupportedTypeError(this._type);
        }
    }

    /** Checks whether the input type is one of the types that are never empty. */
    protected _isNeverEmpty() {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
    }

    /** Checks whether the input is invalid based on the native validation. */
    protected _isBadInput() {
        // The `validity` property won't be present on platform-server.
        let validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
        return validity && validity.badInput;
    }

    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get empty(): boolean {
        return !this._isNeverEmpty() && !this._elementRef.nativeElement.value && !this._isBadInput() &&
            !this.autofilled;
    }

    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    setDescribedByIds(ids: string[]) {
        this._ariaDescribedby = ids.join(' ');
    }

    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    onContainerClick() {
        // Do not re-focus the input element if the element is already focused. Otherwise it can happen
        // that someone clicks on a time input and the cursor resets to the "hours" field while the
        // "minutes" field was actually clicked. See: https://github.com/angular/components/issues/12849
        if (!this.focused) {
            this.focus();
        }
    }
}
