import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    Optional,
    ViewEncapsulation
} from '@angular/core';
import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { CanDisableCtor, mixinDisabled } from '../core/common-behaviors/disabled';
import { BooleanInput } from '@angular/cdk/coercion';
import { CanColorCtor, mixinColor } from '../core/common-behaviors/color';

// Boilerplate for applying mixins to MatButton.
/** @docs-private */
class MatButtonBase {
    constructor(public _elementRef: ElementRef) {}
}
const _GypButtonMixinBase: CanDisableCtor & CanColorCtor &
    typeof MatButtonBase = mixinColor(mixinDisabled(MatButtonBase));


@Component({
    selector: 'button[gyp-button]',
    exportAs: 'gypButton',
    host: {
        // '[attr.disabled]': 'disabled || null',
        '[class._gyp-animation-noopable]': '_animationMode === "NoopAnimations"',
        'class': 'gyp-focus-indicator gyp-button',
    },
    templateUrl: 'button.html',
    styleUrls: ['button.scss'],
    inputs: ['disabled', 'color'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GypButton extends _GypButtonMixinBase implements OnDestroy, FocusableOption {
    constructor(elementRef: ElementRef,
                private _focusMonitor: FocusMonitor,
                @Optional() @Inject(ANIMATION_MODULE_TYPE) public _animationMode: string) {
        super(elementRef);


        elementRef.nativeElement.classList.add('gyp-button-base');

        this._focusMonitor.monitor(this._elementRef, true);
    }

    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    /** Focuses the button. */
    focus(origin: FocusOrigin = 'program', options?: FocusOptions): void {
        this._focusMonitor.focusVia(this._getHostElement(), origin, options);
    }

    _getHostElement() {
        return this._elementRef.nativeElement;
    }

    // Don't know how this property use yet.
    static ngAcceptInputType_disabled: BooleanInput;
}
