import { Component, computed, ElementRef, input, Input, Renderer2 } from '@angular/core';
import { Celda } from '../celda/celda';

@Component({
  selector: '[funcion]',
  imports: [],
  template: '{{valor()}}',
  styleUrl: './funcion.css',
})
export class Funcion {
  valor = input<any>();
  /*
  celdas = input<Array<any>>([]);

  valor = computed(() => {

    let celdasValores = this.celdas() //this.formatear();
    console.log(celdasValores);
    
    return celdasValores.reduce((total: number, valor: number) => total + valor, 0)
  })

  formatear(): Array<number> {
    return this.celdas().map((e: any): number => +e.valor())
  }
*/
}
