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

  limite = 10;

  buscarColumnas = (columnas: Array<number>): Array<Celda> => {
    //if (typeof posicion[0] === 'number') {
    return columnas.map((i) => this.celdas()[i])
    //}
    //return posicion
  }

}
