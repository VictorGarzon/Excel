import { Component, computed, signal, ElementRef, Renderer2, input, AfterViewInit, OnInit, effect, output, untracked, AfterViewChecked, inject } from '@angular/core';
import { FicheroService } from '../../services/fichero.service';
@Component({
  selector: 'td[app-celda],th[app-celda]',
  imports: [],
  templateUrl: './celda.html',
  styleUrl: './celda.css',
})
export class Celda {
  ficheroService = inject(FicheroService)
  valoresIniales = input<any>();
  buscarCeldas = input<(columnas: Array<number>) => Array<Celda>>()
  disabled = input<boolean>();
  parte = input();

  cargado = input();

  valorCelda = input<string>("");
  funcion = input<string>("");
  columnas = input([]);

  valorCambio = signal<string>("");
  cargaElemento = signal(false)

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  //celdas asoscidas
  celdas = computed<Celda[]>(() => {
    if (typeof this.columnas()[0] === 'number') {
      let buscar = this.buscarCeldas();
      return buscar!(this.columnas())
    } else {
      return this.columnas()
    }
  })

  //valor de campo
  valor: any = computed(() => {
    if (!this.cargado()) {
      untracked(() => this.valorCambio.set(this.valorCelda() ?? ''))
      return "";
    }
    try {
      if (this.funcion() && this.columnas() && this.parte() !== "head") {
        let accion = this.funcion() as keyof typeof this.acciones
        let resultado = this.acciones[accion](this.datos());
        return resultado == 0 ? "" : resultado
      } else {
        return this.valorCambio();
      }
    } catch (error) {
      console.error(error);
      return ""
    }
  })

  //sacar datos
  datos() {
    let datos: Array<any> = []
    this.celdas().forEach((e: Celda) => {
      let input = e?.el.nativeElement.querySelector('input');
      //e.renderer.setAttribute(input, 'type', 'number');
      if (isNaN(e?.valor())) {
        e?.renderer.setStyle(e.el.nativeElement, 'border', '2px solid red');
      } else {
        if (+e?.valor() != 0) {
          datos.push(+e.valor())
        }
      }
    })
    return datos;
  }

  valoresCeldas = computed(() => this.celdas().reduce((texto: string, objeto: Celda) => texto + " " + objeto.valor(), this.funcion() + ":"))

  cambiar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.valorCambio.set(valor)
    if (!this.ficheroService.modificado) {
      this.ficheroService.setData(null)
    }
  }

  acciones = {
    sumar: (datos: Array<any>) => datos.reduce((total: number, valor: number) => valor + total, 0),
    restar: (datos: Array<any>) => datos.reduce((total: number, valor: number, i: number) => {
      if (i === 0) {
        return valor
      }
      return total - valor
    }, 0),
  };
}
