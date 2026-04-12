import { Component, computed, signal, ElementRef, Renderer2, input, AfterViewInit, OnInit, effect, output } from '@angular/core';
@Component({
  selector: 'td[app-celda],th[app-celda]',
  imports: [],
  templateUrl: './celda.html',
  styleUrl: './celda.css',
})
export class Celda implements AfterViewInit {
  valoresIniales = input<any>();
  buscarCeldas = input<(columnas: Array<number>) => Array<Celda>>()
  disabled = input<boolean>();
  parte = input();

  valorCelda = input<string>("");
  funcion = input<string>("");
  columnas = input([]);

  valorCambio = signal<string>("");
  carga = signal(false)

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  //cargar
  ngAfterViewInit(): void {
    this.valorCambio.set(this.valorCelda() ?? '')
    this.carga.set(true)
  }

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
    if (!this.carga()) return "";
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
  }

  acciones = {
    sumar: (datos: Array<any>) => datos.reduce((total: number, valor: number) => valor + total, 0),
    restar: (datos: Array<any>) => datos.reduce((total: number, valor: number) => valor - total, 0),
  };
}
