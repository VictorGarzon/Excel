import { Component, computed, signal, OnInit, ElementRef, Renderer2, input, AfterViewInit } from '@angular/core';
@Component({
  selector: 'td[app-celda],th[app-celda]',
  imports: [],
  templateUrl: './celda.html',
  styleUrl: './celda.css', 
})
export class Celda implements OnInit {
  valorInicial = input<any>();
  funcion = input<string>();
  columnas = input<any>();

  valorCampo = signal("");
  
  constructor(private el: ElementRef,private renderer: Renderer2) {}

  valor:any = computed(() => {
    try {
      if (this.funcion() && this.columnas()) {
        let datos = this.columnas().map((e: Celda): number =>{
          if (isNaN(e.valor())) {
            this.renderer.setStyle(e.el.nativeElement, 'border', '2px solid red');
            return 0
          }else{
            return +e.valor()
          }
        })
        let accion = this.funcion() as keyof typeof this.acciones
        return this.acciones[accion](datos)
      } else {
        return this.valorCampo();
      }
    } catch (error) {
      console.error(error);
      return ""
    }
  })

  ngOnInit(): void {
    if (this.valorInicial()) {
      this.valorCampo.set(this.valorInicial())
    }
  }

  cambiar(evento: any) {
    this.valorCampo.set(evento.target.value)
  }

  acciones = {
    sumar: (datos: Array<number>) => datos.reduce((total: number, valor: number) => total + valor, 0),
    restar: (datos: Array<number>) => datos.reduce((total: number, valor: number) => - total + valor , 0),
  };

}
