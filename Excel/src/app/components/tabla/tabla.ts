import { Component, computed, ElementRef, Renderer2, signal, viewChildren } from '@angular/core';
import { Fila } from "../fila/fila";
import { table } from 'console';

@Component({
  selector: 'app-tabla',
  imports: [Fila],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css',
})
export class Tabla {

  filas = viewChildren<Fila>(Fila)
  modoSeleccion = signal(false);
  modo = 0;
  funcion = "";
  seleccion: Array<number> | number = [];
  columnasSelecionadas: Array<number> = [];
  limite = 100;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  buscarColumnas(columna: number) {
    let filasBody = this.filas().slice(1).slice(0, -1)
    return filasBody.map((fila) => fila.celdas()[columna])
  }

  aplicarFuncion(funcion: string) {
    this.modoSeleccion.set(true)
    this.modo = 1;
    this.funcion = funcion;
    this.seleccion = [];
    this.columnasSelecionadas = [];
    /*
let celdas = this.buscarColumnas(6)
for (let celda of celdas) {
  celda.funcion.set(funcion)
  celda.columnas.set([0, 1, 2])
}
  */
  }
  aplicarFuncionColumna(funcion: string) {
    this.modoSeleccion.set(true)
    this.modo = 3;
    this.funcion = funcion;
    this.seleccion = [];
    this.columnasSelecionadas = [];
  }

  onSelect(n: number) {
    if (this.modo != 1) {
      this.removeSeleccion()
    }
    let columnas = document.querySelectorAll("tr td:nth-child(" + (n + 1) + ")")
    columnas.forEach(c => c.classList.toggle("seleccionado"))

    switch (this.modo) {
      case 1:
        if (Array.isArray(this.seleccion)) {
          let posicion = this.seleccion.indexOf(n)
          if (posicion === -1) {
            this.seleccion.push(n)
          } else {
            this.seleccion.splice(posicion, 1)
          }
        }
        break;
      case 2:
      case 3:
        this.seleccion = n;
        break;
      default:
        break;
    }
  }
  confirmarColumnas() {
    this.removeSeleccion()
    switch (this.modo) {
      case 1:
        this.columnasSelecionadas = this.seleccion as Array<number>;
        this.modo = 2;
        break;
      case 2:
        let columnas = this.buscarColumnas(this.seleccion as number)
        columnas.forEach(celda => {
          celda.funcion.set(this.funcion)
          celda.columnas.set(this.columnasSelecionadas)
        })

        this.valoresPredeterminados();
        break;
      case 3:
        let filaFooter = this.filas()[this.filas().length - 1];
        let columna = filaFooter.celdas()[this.seleccion as number]
        columna.funcion.set(this.funcion)
        columna.columnas.set(this.buscarColumnas(this.seleccion as number))
        
        this.valoresPredeterminados();
        break;
      default:
        break;
    }
    this.seleccion = [];
  }

  removeSeleccion() {
    let columnas = document.querySelectorAll(".seleccionado")
    columnas.forEach(c => c.classList.remove("seleccionado"))
  }

  valoresPredeterminados() {
    this.modoSeleccion.set(false)
    this.modo = 0;
    this.funcion = "";
    this.seleccion = [];
    this.columnasSelecionadas = [];
  }

  tabla = {
    header: [
      {
        columna: 0,
        valoresIniales: {
          valor: "dato1"
        }
      },
      {
        columna: 1,
        valoresIniales: {
          valor: "dato2"
        }
      },
      {
        columna: 2,
        valoresIniales: {
          valor: "sumar"
        }
      },
      {
        columna: 4,
        valoresIniales: {
          valor: "restar"
        }
      },
    ],
    body: {
      formato: [
        {
          columna: 2,
          valoresIniales: {
            funcion: 'sumar',
            columnas: [0, 1],
          }
        },
        {
          columna: 3,
          valoresIniales: {
            funcion: 'restar',
            columnas: [0, 1],
          }
        },
      ],
      contenido: [
        {
          fila: 0,
          celdas: [
            {
              columna: 0,
              valoresIniales: {
                valor: 1
              }
            }
          ]
        },
        {
          fila: 1,
          celdas: [
            {
              columna: 1,
              valoresIniales: {
                valor: 2
              }
            }
          ]
        },
        {
          fila: 3,
          celdas: [
          ]
        }
      ]
    },
    footer: [
      {
        columna: 1,
        valoresIniales: {
          funcion: 'sumar',
        }
      },
      {
        columna: 2,
        valoresIniales: {
          funcion: 'sumar',
        }
      },
    ]
  }

}
