import { Component, input, viewChildren } from '@angular/core';
import { Celda } from "../celda/celda";

@Component({
  selector: 'tr[app-fila]',
  imports: [Celda],
  templateUrl: './fila.html',
  styleUrl: './fila.css',
})
export class Fila {
  fila = input<any>()
  celdas = viewChildren<Celda>(Celda)
  //celdas = contentChildren(Celda, { descendants: true });

  buscarColumna(posicion: Array<any>) {
    if (typeof posicion[0] === 'number') {
      return posicion.map((i) => this.celdas()[i])
    }
    return posicion
  }

}
