import { CanDeactivateFn } from '@angular/router';

export interface saveCanDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const saveGuard: CanDeactivateFn<saveCanDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
