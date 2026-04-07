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
  selecionado = output<number>()
  parte = input()

  limite = 50;

  buscarColumnas = (columnas: Array<number>): Array<Celda> => {
    return columnas.map((i) => this.celdas()[i])
  }

  onSelect(n: number) {
    this.selecionado.emit(n);
  }

}
