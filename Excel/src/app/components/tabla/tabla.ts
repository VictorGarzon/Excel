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

  tabla = [
    [
      {
        valorInicial: 1
      },
      {
      },
      {
        funcion: 'sumar',
        columnas: [0,1]
      }
    ],
    [
      {
      },
      {
        valorInicial: 2
      },
      {
        funcion: 'restar',
        columnas: [0, 1]
      }
    ]
  ]

}
