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

  valorCampo = signal<any>(null);
  funcion = signal<string>("")
  columnas = signal<any>(null)
  carga = signal(false)

  constructor(private el: ElementRef, private renderer: Renderer2) {
    effect(() => {
      if (this.valoresIniales()) {
        this.valorCampo.set(this.valoresIniales().valor ?? null)
        this.funcion.set(this.valoresIniales().funcion ?? "")
        this.columnas.set(this.valoresIniales().columnas ?? null)
      }
    })
  }

  celdas = computed(() => {
    if (typeof this.columnas()[0] === 'number') {
      let buscar = this.buscarCeldas();
      return buscar!(this.columnas())
    } else {
      return this.columnas()
    }
  })

  valor: any = computed(() => {
    if (!this.carga()) return "";
    try {
      if (this.funcion() && this.columnas()) {
        let accion = this.funcion() as keyof typeof this.acciones
        let resultado = this.acciones[accion](this.datos());
        return resultado == 0?"":resultado
      } else {
        return this.valorCampo();
      }
    } catch (error) {
      console.error(error);
      return ""
    }
  })

  datos() {
    let datos = this.celdas().map((e: Celda): number => {
      let input = e.el.nativeElement.querySelector('input');
      if (input) {
        e.renderer.setAttribute(input, 'type', 'number');
      }
      if (isNaN(e.valor())) {
        e.renderer.setStyle(e.el.nativeElement, 'border', '2px solid red');
        return 0;
      } else {
        return +e.valor()
      }
    })
    return datos;
  }

  ngAfterViewInit(): void {
    this.carga.set(true)
  }

  cambiar(evento: any) {
    this.valorCampo.set(evento.target.value)
  }

  acciones = {
    sumar: (datos: Array<number>) => datos.reduce((total: number, valor: number) => total + valor, 0),
    restar: (datos: Array<number>) => datos.reduce((total: number, valor: number) => - total + valor, 0),
  };
}
