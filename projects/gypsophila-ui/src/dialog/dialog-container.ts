import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ComponentRef,
    Directive,
    ElementRef, EmbeddedViewRef,
    Inject,
    OnInit, Optional, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, DomPortal, TemplatePortal } from '@angular/cdk/portal';
import { FocusMonitor, FocusOrigin, FocusTrapFactory } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';


/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * @docs-private
 */
export function throwGypDialogContentAlreadyAttachedError() {
    throw Error('Attempting to attach dialog content after content is already attached');
}

@Directive()
export abstract class _GypDialogContainerBase extends BasePortalOutlet {
    protected _document: Document;

    /** The portal outlet inside of this container into which the dialog content will be loaded. */
    @ViewChild(CdkPortalOutlet, {static: true}) _portalOutlet: CdkPortalOutlet;

    private _elementFocusedBeforeDialogWasOpened: HTMLElement;

    /**
     * Type of interaction that led to the dialog being closed. This is used to determine
     * whether the focus style will be applied when returning focus to its original location
     * after the dialog is closed.
     */
    _closeInteractionType: FocusOrigin|null = null;

    /** ID of the element that should be considered as the dialog's label. */
    _ariaLabelledBy: string | null;

    /** ID for the container DOM element. */
    _id: string;

    constructor(
        protected _elementRef: ElementRef,
        protected _focusTrapFactory: FocusTrapFactory,
        protected _changeDetectorRef: ChangeDetectorRef,
        @Optional() @Inject(DOCUMENT) _document: any,
        /** The dialog configuration. */
        // public _config: GypDialogConfig,
        private _focusMonitor?: FocusMonitor) {

        super();
        // this._ariaLabelledBy = _config.ariaLabelledBy || null;
        this._document = _document;
    }

    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
        if (this._portalOutlet.hasAttached()) {
            throwGypDialogContentAlreadyAttachedError();
        }

        return this._portalOutlet.attachComponentPortal(portal);
    }

    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
        if (this._portalOutlet.hasAttached()) {
            throwGypDialogContentAlreadyAttachedError();
        }

        return this._portalOutlet.attachTemplatePortal(portal);
    }

    /**
     * Attaches a DOM portal to the dialog container.
     * @param portal Portal to be attached.
     * @deprecated To be turned into a method.
     * @breaking-change 10.0.0
     */
    attachDomPortal = (portal: DomPortal) => {
        if (this._portalOutlet.hasAttached()) {
            throwGypDialogContentAlreadyAttachedError();
        }

        return this._portalOutlet.attachDomPortal(portal);
    }

    /** Captures the element that was focused before the dialog was opened. */
    private _capturePreviouslyFocusedElement() {
        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;
        }
    }

    /** Focuses the dialog container. */
    private _focusDialogContainer() {
        // Note that there is no focus method when rendering on the server.
        if (this._elementRef.nativeElement.focus) {
            this._elementRef.nativeElement.focus();
        }
    }

    /** Returns whether focus is inside the dialog. */
    private _containsFocus() {
        const element = this._elementRef.nativeElement;
        const activeElement = this._document.activeElement;
        return element === activeElement || element.contains(activeElement);
    }

}


@Component({
    selector: 'gyp-dialog-container',
    templateUrl: 'dialog-container.html',
    encapsulation: ViewEncapsulation.None,
    // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
    // tslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    host: {
        'class': 'gyp-dialog-container',
        'tabindex': '-1',
        'aria-modal': 'true',
    }
})

export class GypDialogContainer extends _GypDialogContainerBase {
}
