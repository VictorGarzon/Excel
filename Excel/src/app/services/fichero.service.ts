import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fichero } from '../models/ficheros';

@Injectable({
  providedIn: 'root',
})
export class FicheroService {
  private ficheroSubject = new BehaviorSubject<Fichero | null>(null);

  fichero$: Observable<Fichero | null> = this.ficheroSubject.asObservable();

  public set(fichero: Fichero) {
    this.ficheroSubject.next(fichero)
  }

  public get() {
    return this.ficheroSubject.value
  }

  public delete() {
    this.ficheroSubject.next(null)
  }
}
