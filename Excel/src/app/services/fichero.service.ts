import { computed, effect, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fichero } from '../models/ficheros';
import { tabla } from '../models/tabla';
import { log } from 'console';

@Injectable({
  providedIn: 'root',
})
export class FicheroService {
  /*
  private ficheroSubject = new BehaviorSubject<Fichero | null>(null);

  fichero$: Observable<Fichero | null> = this.ficheroSubject.asObservable();
  */
  fichero = signal<Fichero | any>(null)

  cargado = signal(false);

  modificado = false

  data = computed(() => {
    return this.fichero()?.data
  })

  permiso = computed<boolean>(() => {
    if (this.fichero()?.permiso == 1) {
      return false
    } else {
      return true
    }
  })

  public setData(data: tabla | null) {
    if (this.fichero() && data) {
      this.fichero.update(f => ({ ...f!, data: data }))
    } else {
      this.fichero.set({
        data: data
      })
    }
    this.modificado = true
  }

  public setNombre(nombre: string) {
    if (this.fichero()) {
      this.fichero.update(f => ({ ...f!, nombre: nombre }))
    } else {
      this.fichero.set({
        nombre: nombre
      })
    }
    this.modificado = true
  }

  public setFechMod(fecha_mod: string) {
    this.fichero.update(f => ({ ...f!, fecha_mod: fecha_mod }))
  }

  public reset() {
    this.fichero.set(null)
    this.modificado = false
  }

}
