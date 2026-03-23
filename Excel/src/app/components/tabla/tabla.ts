import { Component, computed, viewChildren } from '@angular/core';
import { Fila } from "../fila/fila";

@Component({
  selector: 'app-tabla',
  imports: [Fila],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css',
})
export class Tabla {

  filas = viewChildren<Fila>(Fila)

  limite = 100;

  buscarColumnas(columna: number) {
    let filasBody = this.filas().slice(1).slice(0, -1)
    return filasBody.map((fila) => fila.celdas()[columna])
  }

  cambiarColumna(funcion: string) {
    let celdas = this.buscarColumnas(6)
    for (let celda of celdas) {
      celda.funcion.set(funcion)
      celda.columnas.set([0, 1, 2])
    }
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
