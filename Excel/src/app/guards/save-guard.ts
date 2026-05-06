import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { FicheroService } from '../services/fichero.service';

export interface saveCanDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const saveGuard: CanDeactivateFn<saveCanDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  const  fichero = inject(FicheroService)
  if (component.canDeactivate()) {
    fichero.reset()
    return true
  }
  return false
  //return component.canDeactivate ? component.canDeactivate() : true;
};
