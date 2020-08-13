import { Directive, Inject, Injectable, InjectionToken, Injector, OnDestroy, Optional, SkipSelf, Type } from '@angular/core';
import { Overlay, OverlayContainer, ScrollStrategy } from '@angular/cdk/overlay';
import { GypDialogContainer } from './dialog-container';

/** Injection token that determines the scroll handling while the dialog is open. */
export const GYP_DIALOG_SCROLL_STRATEGY =
    new InjectionToken<() => ScrollStrategy>('gyp-dialog-scroll-strategy');

@Directive()
export abstract class _GypDialogBase<C extends _GypDialogContainerBase> implements OnDestroy {
    private _scrollStrategy: () => ScrollStrategy;

    constructor(
        private _overlay: Overlay,
        private _injector: Injector,
        // private _defaultOptions: MatDialogConfig|undefined,
        private _parentDialog: _GypDialogBase<C> | undefined,
        private _overlayContainer: OverlayContainer,
        scrollStrategy: any,
        // private _dialogRefConstructor: Type<MatDialogRef<any>>,
        private _dialogContainerType: Type<C>,
        /*private _dialogDataToken: InjectionToken<any>*/) {
        this._scrollStrategy = scrollStrategy;
    }

    ngOnDestroy() {
    }
}


@Injectable()
export class GypDialog extends _GypDialogBase<GypDialogContainer> {
    constructor(
        overlay: Overlay,
        injector: Injector,
        // @Optional() @Inject(MAT_DIALOG_DEFAULT_OPTIONS) defaultOptions: MatDialogConfig,
        @Inject(GYP_DIALOG_SCROLL_STRATEGY) scrollStrategy: any,
        @Optional() @SkipSelf() parentDialog: GypDialog,
        overlayContainer: OverlayContainer) {
        super(overlay, injector, /*defaultOptions,*/ parentDialog, overlayContainer, scrollStrategy,
            /*MatDialogRef,*/ GypDialogContainer, /*GYP_DIALOG_DATA*/);
    }
}
