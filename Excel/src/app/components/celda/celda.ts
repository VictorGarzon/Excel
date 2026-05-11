import { Component, computed, signal, ElementRef, Renderer2, input, AfterViewInit, OnInit, effect, output, untracked, AfterViewChecked, inject } from '@angular/core';
import { FicheroService } from '../../services/fichero.service';

import { NzPopoverModule } from 'ng-zorro-antd/popover';
@Component({
  selector: 'td[app-celda],th[app-celda]',
  imports: [NzPopoverModule],
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

  celdasAnterior: any = null

  constructor(private el: ElementRef, private renderer: Renderer2) {
    effect(() => {
      if (this.celdasAnterior) {
        this.resetCeldas()
        this.celdasAnterior = null
      }
      if (this.funcion()) {
        const celdas = untracked(() => this.celdas())
        if (celdas) {
          this.celdasAnterior = celdas
        }
      }
    })
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
    if (!this.cargado()) {
      untracked(() => this.valorCambio.set(this.valorCelda() ?? ''))
      return "";
    }
    try {
      if (this.funcion() && this.columnas() && this.parte() !== "head") {
        let accion = this.funcion() as keyof typeof this.acciones
        let resultado = this.acciones[accion]();
        return resultado ?? ""
      } else {
        return this.valorCambio();
      }
    } catch (error) {
      console.error(error);
      return ""
    }
  })

  cambiar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.valorCambio.set(valor)
    if (!this.ficheroService.modificado) {
      this.ficheroService.setData(null)
    }
  }

  valoresCeldas = computed(() => this.celdas().reduce((texto: string, objeto: Celda) => (texto ? texto + "-" : texto) + objeto.valor(), ""))

  //sacar datos
  datosNum() {
    let datos: Array<any> = []
    this.celdas().forEach((e: Celda) => {
      let input = e?.el.nativeElement.querySelector('input');
      if (isNaN(e?.valor())) {
        e?.renderer.addClass(e.el.nativeElement, 'error');
      } else {
        e.renderer.setAttribute(input, 'type', 'number');
        e?.renderer.removeClass(e.el.nativeElement, 'error');
        if (e?.valor() !== '') {
          datos.push(+e.valor())
        }
      }
    })
    if (datos.length == 0) {
      return null
    }
    return datos;
  }

  datosFecha() {
    let datos: Array<any> = []
    this.celdas().forEach((e: Celda) => {
      const fecha = new Date(e?.valor());
      let input = e?.el.nativeElement.querySelector('input');
      if (e?.valor() && isNaN(fecha.getTime())) {
        e?.renderer.addClass(e.el.nativeElement, 'error');
      } else {
        e.renderer.setAttribute(input, 'type', 'date');
        e?.renderer.removeClass(e.el.nativeElement, 'error');
        if (fecha.getTime()) {
          const regex = /^\d{4}-\d{2}-\d{2}$/;
          if (!regex.test(e?.valor())) {
            const fechaFormat = fecha.toISOString().split('T')[0]
            console.log(fechaFormat);
            e?.renderer.setProperty(input, 'value', fechaFormat);
          };
          datos.push(fecha)
        }
      }
    })
    if (datos.length == 0) {
      return null
    }
    return datos;
  }

  resetCeldas() {
    this.celdasAnterior.forEach((e: Celda) => {
      let input = e?.el.nativeElement.querySelector('input');
      e.renderer.setAttribute(input, 'type', 'text');
      e?.renderer.removeClass(e.el.nativeElement, 'error');
    })
  }

  acciones = {
    suma: () => this.datosNum()?.reduce((total: number, valor: number) => valor + total, 0),
    resta: () => this.datosNum()?.reduce((total: number, valor: number, i: number) => {
      if (i === 0) {
        return valor
      }
      return total - valor
    }, 0),
    promedio: () => {
      const datos = this.datosNum()
      if (!datos) {
        return null
      }
      return datos.reduce((total: number, valor: number) => valor + total, 0) / datos.length
    },
    multiplicacion: () => this.datosNum()?.reduce((total: number, valor: number) => valor * total, 1),
    division: () => {
      let re = this.datosNum()?.reduce((total: number, valor: number, i: number) => {
        if (i === 0) {
          return valor
        }
        return total / valor
      }, 0)
      console.log(re);
      return re
    },
    dias: () => {
      const datos = this.datosFecha()
      if (!datos || datos.length == 1) {
        return null
      }
      if (datos.length != 2) {
        return 'solo se permiten dos campos'
      }
      const fecha1 = datos[0]
      const fecha2 = datos[1]
      const time = fecha2 - fecha1;
      return Math.floor(time / (1000 * 60 * 60 * 24));
    },
    meses: () => {
      const datos = this.datosFecha()
      if (!datos || datos.length == 1) {
        return null
      }
      if (datos.length != 2) {
        return 'solo se permiten dos campos'
      }
      const fecha1 = datos[0]
      const fecha2 = datos[1]
      return (fecha2.getFullYear() - fecha1.getFullYear()) * 12 + (fecha2.getMonth() - fecha1.getMonth());
    },
  };
}
