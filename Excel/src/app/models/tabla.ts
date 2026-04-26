export interface tablaFuncion {
  columna: number,
  funcion: string,
  columnas?: Array<any>
}

export interface tablaColumna {
  columna: number,
  valor: any
}

export interface tablaFila {
  fila: number,
  columnas: Array<tablaColumna>
}

export interface tabla {
  functions: Array<tablaFuncion>,
  headers: Array<tablaColumna>,
  rows: Array<tablaFila>,
  footers: Array<tablaFuncion>
}