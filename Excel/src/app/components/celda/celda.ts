import { Component, computed, signal, ElementRef, Renderer2, input, AfterViewInit } from '@angular/core';
@Component({
  selector: 'td[app-celda],th[app-celda]',
  imports: [],
  templateUrl: './celda.html',
  styleUrl: './celda.css',
})
export class Celda implements AfterViewInit {
  valorInicial = input<any>();
  funcion = input<string>();
  columnas = input<Array<Celda>>();

  valorCampo = signal("");
  carga = signal(false)

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  valor: any = computed(() => {
    try {
      if (this.carga()) {
        if (this.funcion() && this.columnas()) {
          let datos = this.columnas()?.map((e: Celda): number => {
            let input = e.el.nativeElement.querySelector('input');
            if (input) {
              e.renderer.setAttribute(input, 'type', 'number');
            }
            if (isNaN(e.valor())) {
              this.renderer.setStyle(e.el.nativeElement, 'border', '2px solid red');
              return 0
            } else {
              return +e.valor()
            }
          })
          let accion = this.funcion() as keyof typeof this.acciones
          return this.acciones[accion](datos ?? [])
        } else {
          return this.valorCampo();
        }
      } else {
        return ""
      }
    } catch (error) {
      console.error(error);
      return ""
    }
  })

  ngAfterViewInit(): void {
    if (this.valorInicial()) {
      this.valorCampo.set(this.valorInicial())
    }
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
