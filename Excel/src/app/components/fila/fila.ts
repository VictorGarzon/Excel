import { AfterViewInit, Component, computed, effect, ElementRef, input, output, Renderer2, signal, untracked, viewChildren } from '@angular/core';
import { Celda } from "../celda/celda";

@Component({
  selector: 'tr[app-fila]',
  imports: [Celda],
  templateUrl: './fila.html',
  styleUrl: './fila.css',
})
export class Fila {
  celdas = viewChildren<Celda>(Celda)
  data = input<any>()

  cargado = input()
  //tamaño total columna
  tamColumna = input<number>();

  disabled = input<boolean>();
  modoSelect = input<boolean>();
  selecionado = output<number>()
  ampliar = output()

  ultimo = input()
  carout = output()

  posicionFila = 0;

  //array
  arrayColumn = computed(() => [].constructor(this.tamColumna()! + 1 + 2))

  parte = computed(() => Object.keys(this.data())[0])

  fila = computed<any>(() => Object.values(this.data())[0])

  //saber a que columna pertenece a la hora de hacer funciones
  buscarColumnas = (columnas: Array<number>): Array<Celda> => {
    return columnas.map((i) => this.celdas()[i])
  }

  //selecinar
  onSelect(n: number) {
    this.selecionado.emit(n);
  }

  //para recorrer la fila
  buscarCelda(n: number) {
    if (!this.fila().length) {
      if (this.ultimo()) {
        this.carout.emit()
      }
      return null
    }
    let celda = this.fila()[this.posicionFila]?.columna == n ? this.fila()[this.posicionFila] : null
    if (celda) {
      this.posicionFila++;
      if (this.posicionFila == this.fila().length) {
        this.posicionFila = 0;
        if (this.ultimo()) {
          this.carout.emit()
        }
      }
      return celda;
    }
    return null;
  }


}
