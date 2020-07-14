import {FormControl, FormGroupDirective, NgControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {ErrorStateMatcher} from './error-options';
import {Constructor} from './constructor';


/** @docs-private */
export interface CanUpdateErrorState {
  updateErrorState(): void;
  readonly stateChanges: Subject<void>;
  errorState: boolean;
  errorStateMatcher: ErrorStateMatcher;
}

/** @docs-private */
export type CanUpdateErrorStateCtor = Constructor<CanUpdateErrorState>;

/** @docs-private */
export interface HasErrorState {
  _parentFormGroup: FormGroupDirective;
  _defaultErrorStateMatcher: ErrorStateMatcher;
  ngControl: NgControl;
}

/**
 * Mixin to augment a directive with updateErrorState method.
 * For component with `errorState` and need to update `errorState`.
 */
export function mixinErrorState<T extends Constructor<HasErrorState>>(base: T)
: CanUpdateErrorStateCtor & T {
  return class extends base {
    /** Whether the component is in an error state. */
    errorState: boolean = false;

    readonly stateChanges = new Subject<void>();

    errorStateMatcher: ErrorStateMatcher;

    updateErrorState() {
      const oldState = this.errorState;
      const parent = this._parentFormGroup;
      const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
      const control = this.ngControl ? this.ngControl.control as FormControl : null;
      const newState = matcher.isErrorState(control, parent);

      if (newState !== oldState) {
        this.errorState = newState;
        this.stateChanges.next();
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
