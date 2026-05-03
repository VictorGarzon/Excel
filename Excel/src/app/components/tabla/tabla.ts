import { afterNextRender, AfterViewChecked, AfterViewInit, Component, computed, effect, ElementRef, HostListener, inject, signal, untracked, viewChild, viewChildren } from '@angular/core';
import { Fila } from "../fila/fila";
import { tabla, tablaColumna, tablaFila, tablaFuncion } from '../../models/tabla';
import { NzLayoutComponent, NzHeaderComponent, NzContentComponent } from "ng-zorro-antd/layout";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { MessageService } from '../../services/message.service';
import { FicheroService } from '../../services/fichero.service';
import { firstValueFrom, switchMap, tap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { HeaderTabla } from "../header-tabla/header-tabla";
import { saveCanDeactivate } from '../../guards/save-guard';


import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-tabla',
  imports: [Fila, NzLayoutComponent, NzContentComponent, NzGridModule, NzIconModule, NzFlexModule, HeaderTabla, NzAlertModule, NzButtonModule, NzSpaceModule],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css',
})
export class Tabla implements saveCanDeactivate {
  message = inject(MessageService)
  ficheroService = inject(FicheroService)
  private api = inject(ApiService)

  filas = viewChildren<Fila>(Fila)
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
    //poner tamaño inicial
    afterNextRender(() => {
      let height = window.innerHeight > window.outerHeight ? window.innerHeight : window.outerHeight;
      let width = window.innerWidth > window.outerWidth ? window.innerWidth : window.outerWidth;
      let alto = Math.ceil(height / 50);
      let ancho = Math.ceil(width / 100);

      this.tamFila.update(tam => alto > tam ? alto : tam)
      this.tamColumna.update(tam => ancho > tam ? ancho : tam)

      this.altoPantalla = alto
      this.anchoPantalla = ancho
    })
    // en caso de cambio de la data que cambie
    effect(() => {
      let data = this.ficheroService.data();
      if (!this.ficheroService.modificado) {
        untracked(() => this.reinicio(data))
      }
    })
    effect(() => {
      this.ficheroService.cargado.set(this.cargado())
    })
  }

  canDeactivate(): boolean {
    if (this.ficheroService.modificado) {
      let salir = confirm('Tienes cambios sin guardar ¿Quieres salir?');
      if (salir) {
        this.ficheroService.reset()
      }
      return salir;
    }
    return true;
  }

  //alert cerrar ventana
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.ficheroService.modificado) {
      event.preventDefault();
    }
  }

  // recarga la tabla con nuevos datos
  reinicio(jsonData: any) {

    this.cargado.set(false)

    this.tamFila.set(this.altoPantalla)
    this.tamColumna.set(this.anchoPantalla)

    this.organizarHeaders(jsonData?.headers ?? null);
    this.organizarRows(jsonData?.rows ?? null);
    this.organizarFooter(jsonData?.footers ?? null);
    this.organizarFunctions(jsonData?.functions ?? null);
    this.ficheroService.modificado = false;
  }

  // terminado de cargar
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
    if (obj && obj.length > 0) {
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
    if (obj && obj.length > 0) {
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
    if (obj && obj.length > 0) {
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
      } else {
        this.ficheroService.modificado = true;
      }

      this.functions.set(datos)
    } else {
      this.functions.set([])
    }
  }

  organizarFooter(obj: any) {
    if (obj && obj.length > 0) {
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
      } else {
        this.ficheroService.modificado = true;
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

  //aplicar funciones

  modeSelectMult = signal(false);
  modeSelect = signal(false);
  seleccion: Array<number> | number = [];
  columnasSelecionadas: Array<number> = [];

  clearSelect() {
    if (this.cargado()) { // no da tiempo a cargar el document.querySelectorAll
      this.removeSeleccionado();
      this.removeSeleccionadoFinal()
      this.seleccion = []
      this.columnasSelecionadas = [];
    }
  }

  removeSeleccionado() {
    let columnas = document.querySelectorAll(".seleccionado")
    columnas.forEach(c => c.classList.remove("seleccionado"))
  }

  removeSeleccionadoFinal() {
    let columnas = document.querySelectorAll(".seleccionadofinal")
    columnas.forEach(c => c.classList.remove("seleccionadofinal"))
  }

  onSelect(n: number) {
    if (this.modeSelectMult()) {
      let columnas = document.querySelectorAll("tr td:nth-child(" + (n + 1) + ")")
      columnas.forEach(c => c.classList.toggle("seleccionado"))
      if (Array.isArray(this.seleccion)) {
        let posicion = this.seleccion.indexOf(n)
        if (posicion === -1) {
          this.seleccion.push(n)
        } else {
          this.seleccion.splice(posicion, 1)
        }
      }
    } else {
      if (Array.isArray(this.seleccion)) {
        this.columnasSelecionadas = this.seleccion
      }
      if (this.columnasSelecionadas.indexOf(n) === -1) {
        this.removeSeleccionadoFinal()
        let columnas = document.querySelectorAll("tr td:nth-child(" + (n + 1) + ")")
        columnas.forEach(c => c.classList.toggle("seleccionadofinal"))
        this.seleccion = n;
      } else {
        this.message.createBasicMessage('warning', "esta columna no se puede seleccinar")
      }
    }
  }

  aplicar(config: { tipo: string, funcion: string }) {
    if (config.tipo === 'f') {
      let functions = [...this.functions()];
      functions.push({
        columna: this.seleccion as number,
        funcion: config.funcion,
        columnas: this.columnasSelecionadas
      })
      this.organizarFunctions(functions);
    } else {
      let footers = [...this.footers()];
      footers.push({
        columna: this.seleccion as number,
        funcion: config.funcion,
      })
      this.organizarFooter(footers);
    }
  }

  //Descargar y subir

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const content = e.target.result;
        const jsonData = JSON.parse(content);
        this.reinicio(jsonData)
        this.message.createBasicMessage("success", "Subido con exito")
      } catch (error) {
        this.message.createBasicMessage("error", "El archivo no tiene un formato JSON válido")
      }
    };

    reader.readAsText(file);
    event.target.value = ""
  }

  download() {
    const tabla = this.formatUpload();
    const data = JSON.stringify(tabla, null, 2);
    const blob = new Blob([data], { type: 'application/json' });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'datos.json';

    link.click();

    window.URL.revokeObjectURL(url);
    this.ficheroService.modificado = false;
  }

  async uploadDB(acept: boolean = false) {
    try {
      let fichero = this.ficheroService.fichero();
      if (!fichero?.nombre) {
        this.message.createBasicMessage('error', "Se necesita nombre")
      } else {
        const data = this.formatUpload();
        let newData: any = {
          nombre: fichero!.nombre,
          data: data
        }
        if (fichero.id) {
          try {
            this.closedAlert();
            newData.fecha_mod = fichero.fecha_mod
            newData.acept = acept;
            let fecha_mod = await firstValueFrom(
              this.api.patch('fichero/' + fichero.id, newData)
            )
            untracked(() => this.ficheroService.setData(data))
            untracked(() => this.ficheroService.setFechMod(fecha_mod))
            this.message.createBasicMessage('success', "Se ha guardado")
          } catch (err: any) {
            if (err.status == 409) {
              this.showAlert();
            } else {
              throw err
            }
          }
        } else {
          newData.tipo = 1;
          await firstValueFrom(
            this.api.post('fichero', newData).pipe(
              switchMap((id) => this.api.get('fichero/' + id)),
              tap(f => untracked(() => this.ficheroService.fichero.set(f))),
            )
          )
          this.message.createBasicMessage('success', "Se ha creado un nuevo fichero")
        }
        this.ficheroService.modificado = false;
      }
    } catch (err: any) {
      if (err.status == 409) {

      } else {
        this.message.createBasicMessage('error', err.message)
      }
    }
  }

  formatUpload() {
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
    return { headers: head, rows: body, functions: this.functions(), footers: this.footers() }
  }

  visibleAlert = signal(false)

  showAlert() {
    this.visibleAlert.set(true)
  }
  closedAlert() {
    this.visibleAlert.set(false)
  }
}
