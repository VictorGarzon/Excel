import { AfterViewInit, Component, computed, contentChildren, viewChildren } from '@angular/core';
import { Fila } from "../fila/fila";

@Component({
  selector: 'app-tabla',
  imports: [Fila],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css',
})
export class Tabla {

  filas = viewChildren<Fila>(Fila)

  buscarColumna(columna: number) {
    let filasBody = this.filas().slice(1).slice(0, -1)
    return filasBody.map((fila) => fila.celdas()[columna])
  }

  tabla = {
    header: [
      [
        {
          columna: 0,
          valorInicial: "dato1"
        },
        {
          columna: 1,
          valorInicial: "dato2"
        },
        {
          columna: 2,
          valorInicial: "suma"
        },
      ]
    ],
    body: {
      formato: [
        {
          columna: 2,
          funcion: 'sumar',
          columnas: [0, 1],
        },
        {
          columna: 3,
          funcion: 'restar',
          columnas: [0, 1],
        },
      ],
      contenido: [
        {
          fila: 0,
          celdas: [
            {
              columna: 0,
              valorInicial: 1
            }
          ]
        },
        {
          fila: 1,
          celdas: [
            {
              columna: 1,
              valorInicial: 2
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
      [{
          columna: 1,
          funcion: 'sumar',
        },
        {
          columna: 2,
          funcion: 'sumar',
        },
      ]
    ]
  }

}
