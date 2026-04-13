import { AfterViewInit, Component, computed, ElementRef, input, output, Renderer2, signal, viewChildren } from '@angular/core';
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
  ampliar = output()
  parte = input()
  car = input()
  tamColumna = input<number>();

  posicionFila = 0;

  arrayColumn = computed(() => [].constructor(this.tamColumna()! + 1 + 5))

  buscarColumnas = (columnas: Array<number>): Array<Celda> => {
    return columnas.map((i) => this.celdas()[i])
  }

  onSelect(n: number) {
    this.selecionado.emit(n);
  }

  buscarCelda(n: number) {
    let celda = this.fila()[this.posicionFila]?.columna == n ? this.fila()[this.posicionFila] : null
    if (celda) {
      this.posicionFila++;
      if (this.posicionFila == this.fila().length) {
        this.posicionFila = 0;
      }
      return celda;
    }
    return null;
  }


}
