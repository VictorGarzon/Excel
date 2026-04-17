import { afterNextRender, AfterViewChecked, AfterViewInit, Component, computed, effect, signal, untracked, viewChildren } from '@angular/core';
import { Fila } from "../fila/fila";

interface tablaFuncion {
  columna: number,
  funcion: string,
  columnas?: Array<any>
}

interface tablaColumna {
  columna: number,
  valor: any
}

interface tablaFila {
  fila: number,
  columnas: Array<tablaColumna>
}

interface tabla {
  functions: Array<tablaFuncion>,
  headers: Array<tablaColumna>,
  rows: Array<tablaFila>,
  footers: Array<tablaFuncion>
}


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

  tamFila = signal<number>(0)
  tamColumna = signal<number>(0)

  functions = signal<Array<tablaFuncion>>([]);
  headers = signal<Array<tablaColumna>>([]);
  rows = signal<Array<tablaFila>>([]);
  footers = signal<Array<tablaFuncion>>([]);

  cargado = signal(false)

  posicionFila = 0;

  altoPantalla = 0;
  anchoPantalla = 0;

  constructor() {
    afterNextRender(() => {
      let alto = Math.ceil(window.innerHeight / 50);
      let ancho = Math.ceil(window.innerWidth / 100);

      this.tamFila.update(tam => alto > tam ? alto : tam)
      this.tamColumna.update(tam => ancho > tam ? ancho : tam)

      this.altoPantalla = alto
      this.anchoPantalla = ancho
    })
    let data
    if (data) {
      this.reinicio(data)
    }
  }

  reinicio(jsonData: tabla) {

    this.cargado.set(false)

    this.tamFila.set(this.altoPantalla)
    this.tamColumna.set(this.anchoPantalla)

    this.organizarHeaders(jsonData.headers ?? null);
    this.organizarRows(jsonData.rows ?? null);
    this.organizarFooter(jsonData.footers ?? null);
    this.organizarFunctions(jsonData.functions ?? null);
  }

  bodyCargado() {
    this.cargado.set(true)
  }

  //recorrer las filas
  buscarFila(n: number) {
    let fila = this.rows()[this.posicionFila]?.fila == n ? this.rows()[this.posicionFila] : null
    if (fila) {
      this.posicionFila++;
      if (this.posicionFila == this.rows().length) {
        this.posicionFila = 0;
      }
      return fila;
    }
    return null;
  }

  //cuanto amplio
  ampliarFila() {
    this.tamFila.update(tam => tam + 2)
  }

  ampliarColum() {
    this.tamColumna.update(tam => tam + 2)
  }

  //array de las filas
  arrayFila = computed(() => [].constructor(this.tamFila() + 1 + 2))

  //organidar para evitar repetidos y otros errores al importar la tabla
  organizarHeaders(obj: any) {
    if (obj) {
      let datos: Array<tablaColumna> = Object.values(
        obj.reduce((conjunto: any, elemeto: any) => {
          const columna = elemeto.columna
          conjunto[columna] = { ...conjunto[columna], ...elemeto };
          return conjunto;
        }, {} as Record<number, any>)
      )
      let ultimaColumna = datos[datos.length - 1].columna;
      this.tamColumna.update(tam => ultimaColumna > tam ? ultimaColumna : tam)

      this.headers.set(datos)
    } else {
      this.headers.set([])
    }
  }

  organizarRows(obj: any) {
    if (obj) {
      let datos: Array<tablaFila> = Object.values(
        obj.reduce((conjunto: any, elemeto: any) => {
          const fila = elemeto.fila
          if (!conjunto[fila]) {
            conjunto[fila] = { ...elemeto, columnas: this.column(...elemeto.columnas) }
          } else {
            conjunto[fila] = { ...conjunto[fila], ...elemeto, columnas: this.column(...conjunto[fila].columnas, ...elemeto.columnas) };
          }
          return conjunto;
        }, {} as Record<number, any>)
      )
      let ultimaFila = datos[datos.length - 1].fila
      this.tamFila.update(tam => ultimaFila > tam ? ultimaFila : tam)

      let ultimaColumna = Math.max(...datos.map(f => Math.max(...f.columnas.map(c => c.columna))));
      this.tamColumna.update(tam => ultimaColumna > tam ? ultimaColumna : tam)

      this.rows.set(datos)
    } else {
      this.rows.set([])
    }
  }

  column(...columnas: any) {
    return Object.values(
      columnas.reduce((conjunto: any, elemeto: any) => {
        const columna = elemeto.columna
        conjunto[columna] = { ...conjunto[columna], ...elemeto };
        return conjunto;
      }, {} as Record<number, any>)
    )
  }

  organizarFunctions(obj: any) {
    if (obj) {
      let datos: Array<tablaFuncion> = Object.values(
        obj.reduce((conjunto: any, elemeto: any) => {
          const columna = elemeto.columna
          conjunto[columna] = { ...conjunto[columna], ...elemeto };
          if (!conjunto[columna].funcion) delete conjunto[columna];
          return conjunto;
        }, {} as Record<number, any>)
      )
      if (!this.cargado()) {
        let ultimaColumna = datos[datos.length - 1].columna;
        this.tamColumna.update(tam => ultimaColumna > tam ? ultimaColumna : tam)
      }

      this.functions.set(datos)
    } else {
      this.functions.set([])
    }
  }

  organizarFooter(obj: any) {
    if (obj) {
      let datos: Array<tablaFuncion> = Object.values(
        obj.reduce((conjunto: any, elemeto: any) => {
          const columna = elemeto.columna
          conjunto[columna] = { ...conjunto[columna], ...elemeto };
          if (!conjunto[columna].funcion) delete conjunto[columna];
          return conjunto;
        }, {} as Record<number, any>)
      )

      if (!this.cargado()) {
        let ultimaColumna = datos[datos.length - 1].columna;
        this.tamColumna.update(tam => ultimaColumna > tam ? ultimaColumna : tam)
      }

      this.footers.set(datos)
    } else {
      this.footers.set([])
    }
  }

  footerColumnas = computed(() =>
    this.footers().map((col: any) => ({ ...col, columnas: this.buscarColumnas(col.columna) }))
  )

  //sacar las celdas de una columna
  buscarColumnas(columna: number) {
    let body = this.filas().slice(1).slice(0, -1)
    let celdas = body.map((fila) => fila.celdas()[columna])
    return celdas;
  }

  // Aplicar funciones

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
        let functions = [...this.functions()];
        functions.push({
          columna: this.seleccion as number,
          funcion: this.funcion,
          columnas: this.columnasSelecionadas
        })

        this.organizarFunctions(functions);

        this.valoresPredeterminados();
        break;
      case 3:
        let footers = [...this.footers()];
        footers.push({
          columna: this.seleccion as number,
          funcion: this.funcion,
        })

        this.organizarFooter(footers);

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

    let head: Array<tablaColumna> = [];
    this.filas()[0].celdas().forEach((c, cn) => c.valor() && head.push({
      columna: cn,
      valor: c.valor()
    }))

    let body: Array<tablaFila> = [];
    this.filas().slice(1).slice(0, -1).forEach((f, fn) => {
      let rows: Array<tablaColumna> = [];
      f.celdas().forEach((c, cn) => c.valor() && !c.funcion() && rows.push({
        columna: cn,
        valor: c.valor()
      }))

      rows.length && body.push({
        fila: fn,
        columnas: rows
      })
    })

    const dataStr = JSON.stringify({ headers: head, rows: body, functions: this.functions(), footers: this.footers() }, null, 2);

    const blob = new Blob([dataStr], { type: 'application/json' });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'datos.json';

    link.click();

    window.URL.revokeObjectURL(url);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const content = e.target.result;
        const jsonData = JSON.parse(content);
        this.reinicio(jsonData)
      } catch (error) {
        console.error('Error: El archivo no tiene un formato JSON válido', error);
      }
    };

    reader.readAsText(file);
    event.target.value = ""
  }
  /*
    tabla = signal<tabla>({
      functions: [
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
      headers: [
        {
          columna: 0,
          valor: "dato1"
        },
        {
          columna: 1,
          valor: "dato2"
        },
        {
          columna: 2,
          valor: "sumar1"
        },
        {
          columna: 3,
          valor: "restar2"
        },
      ],
      rows: [
        {
          fila: 5,
          columnas: [
            {
              columna: 1,
              valor: 1
            },
            {
              columna: 6,
              valor: 1
            },
            {
              columna: 0,
              valor: 2
            }
          ]
        },
        {
          fila: 1,
          columnas: [
            {
              columna: 1,
              valor: 2
            }
          ]
        },
        {
          fila: 3,
          columnas: [
            {
              columna: 1,
              valor: 2
            }
          ]
        }
      ],
      footers: [
        {
          columna: 4,
          funcion: 'sumar',
        },
        {
          columna: 1,
          funcion: 'restar',
        },
        {
          columna: 2,
          funcion: 'sumar',
        },
      ]
    })
  */
}
