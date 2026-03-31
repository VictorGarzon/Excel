import { Component, ElementRef, input, output, Renderer2, viewChildren } from '@angular/core';
import { Celda } from "../celda/celda";

@Component({
  selector: 'tr[app-fila]',
  imports: [Celda],
  templateUrl: './fila.html',
  styleUrl: './fila.css',
})
export class Fila {
  fila = input<any>()
  disabled = input<boolean>();
  celdas = viewChildren<Celda>(Celda)
  //celdas = contentChildren(Celda, { descendants: true });
  selecionado = output<number>()

  limite = 50;

  buscarColumnas = (columnas: Array<number>): Array<Celda> => {
    //if (typeof posicion[0] === 'number') {
    return columnas.map((i) => this.celdas()[i])
    //}
    //return posicion
  }

  onSelect(n:number) {
    this.selecionado.emit(n);
  }

}
