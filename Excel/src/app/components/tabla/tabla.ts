import { AfterViewInit, Component, computed, signal, viewChildren } from '@angular/core';
import { Fila } from "../fila/fila";
import { Celda } from '../celda/celda';

@Component({
  selector: 'app-tabla',
  imports: [Fila],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css',
})
export class Tabla implements AfterViewInit {

  filas = viewChildren<Fila>(Fila)
  modoSeleccion = signal(false);
  modo = 0;
  funcion = "";
  seleccion: Array<number> | number = [];
  columnasSelecionadas: Array<number> = [];
  limite = 100;

  ngAfterViewInit(): void {
    this.footer().forEach(e => {
      let columna = this.filaFooter().celdas()[e.columna]
      columna.columnas.set(this.buscarColumnas(e.columna))
    })
  }

  header() {
    return Object.values(
      [...this.tabla.header, ...this.tabla.formato].reduce((conjunto, elemeto) => {
        const columna = elemeto.columna
        if (!conjunto[columna]) {
          conjunto[columna] = { ...elemeto }
        } else {
          conjunto[columna] = { ...conjunto[columna], ...elemeto, valoresIniales: { ...conjunto[columna].valoresIniales, ...elemeto.valoresIniales } };
        }
        return conjunto;
      }, {} as Record<number, any>)
    )
  }
  body() {
    return Object.values(
      this.tabla.body.reduce((conjunto, elemeto) => {
        const fila = elemeto.fila
        if (!conjunto[fila]) {
          conjunto[fila] = { ...elemeto, columnas: [...this.columnas(elemeto.columnas)] }
        } else {
          conjunto[fila] = { ...conjunto[fila], ...elemeto, columnas: [...conjunto[fila].columnas, ...this.columnas(elemeto.columnas)] };
        }
        return conjunto;
      }, {} as Record<number, any>)
    )
  }

  columnas(columnas: any) {
    return Object.values(
      [...this.tabla.formato, ...columnas].reduce((conjunto, elemeto) => {
        const columna = elemeto.columna
        if (!conjunto[columna]) {
          conjunto[columna] = { ...elemeto }
        } else {
          conjunto[columna] = { ...conjunto[columna], ...elemeto, valoresIniales: { ...conjunto[columna].valoresIniales, ...elemeto.valoresIniales } };
        }
        return conjunto;
      }, {} as Record<number, any>)
    )
  }

  footer() {
    return Object.values(
      this.tabla.footer.reduce((conjunto, elemeto) => {
        const columna = elemeto.columna
        if (!conjunto[columna]) {
          conjunto[columna] = { ...elemeto }
        } else {
          conjunto[columna] = { ...conjunto[columna], ...elemeto, valoresIniales: { ...conjunto[columna].valoresIniales, ...elemeto.valoresIniales } };
        }
        return conjunto;
      }, {} as Record<number, any>)
    )
  }

  filaHeader = computed(() => this.filas()[0])

  filasBody = computed(() => this.filas().slice(1).slice(0, -1))

  filaFooter = computed(() => this.filas()[this.filas().length - 1])

  buscarColumnas(columna: number) {
    let celdas = this.filasBody().map((fila) => fila.celdas()[columna])
    return celdas;
  }

  aplicarFuncion(funcion: string) {
    this.modoSeleccion.set(true)
    this.modo = 1;
    this.funcion = funcion;
    this.seleccion = [];
    this.columnasSelecionadas = [];
  }

  aplicarFuncionColumna(funcion: string) {
    this.modoSeleccion.set(true)
    this.modo = 3;
    this.funcion = funcion;
    this.seleccion = [];
    this.columnasSelecionadas = [];
  }

  eliminarFuncion() {
    this.modoSeleccion.set(true)
    this.modo = 2;
  }

  onSelect(n: number) {
    if (this.modo != 1) {
      this.removeSeleccion()
    }
    let columnas = document.querySelectorAll("tr td:nth-child(" + (n + 1) + ")")
    columnas.forEach(c => c.classList.toggle("seleccionado"))

    if (this.modo === 1) {
      if (Array.isArray(this.seleccion)) {
        let posicion = this.seleccion.indexOf(n)
        if (posicion === -1) {
          this.seleccion.push(n)
        } else {
          this.seleccion.splice(posicion, 1)
        }
      }
    } else {
      this.seleccion = n;
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

        let head = this.filaHeader().celdas()[this.seleccion as number]
        head.funcion.set(this.funcion)
        head.columnas.set(this.columnasSelecionadas)

        this.valoresPredeterminados();
        break;
      case 3:
        let columna = this.filaFooter().celdas()[this.seleccion as number]
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

  exportar() {
    let formato: any = [];
    let header: any = [];
    let body: any = [];
    let footer: any = [];
    this.filaHeader().celdas().forEach((e, i) => {
      if (e.valor()) {
        header.push({
          columna: i,
          valoresIniales: {
            valor: e.valor()
          }
        })
      }
      if (e.funcion()) {
        formato.push({
          columna: i,
          valoresIniales: {
            funcion: e.funcion(),
            columnas: e.columnas(),
          }
        })
      }
    })

    this.filaFooter().celdas().forEach((e, i) => {
      if (e.funcion()) {
        footer.push({
          columna: i,
          valoresIniales: {
            funcion: e.funcion(),
          }
        })
      }
    })

    this.filasBody().forEach((fila, nfila) => {
      let columnas: any = [];
      fila.celdas().forEach((columna, ncolumna) => {
        if (!columna.funcion() && columna.valor()) {
          columnas.push({
            columna: ncolumna,
            valoresIniales: {
              valor: columna.valor()
            }
          })
        }
      });
      if (columnas.length != 0) {
        body.push({
          fila: nfila,
          columnas: columnas
        })
      }
    })

    const dataStr = JSON.stringify({ formato, header, body, footer }, null, 2);

    const blob = new Blob([dataStr], { type: 'application/json' });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'datos.json';

    link.click();

    window.URL.revokeObjectURL(url);


  }

  tabla = {
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
        columna: 3,
        valoresIniales: {
          valor: "restar"
        }
      },
    ],
    body: [
      {
        fila: 5,
        columnas: [
          {
            columna: 1,
            valoresIniales: {
              valor: 1
            }
          },
          {
            columna: 0,
            valoresIniales: {
              valor: 2
            }
          }
        ]
      },
      {
        fila: 1,
        columnas: [
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
        columnas: [
          {
            columna: 1,
            valoresIniales: {
              valor: 2
            }
          }
        ]
      }
    ],
    footer: [
      {
        columna: 4,
        valoresIniales: {
          funcion: 'sumar',
        }
      },
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
