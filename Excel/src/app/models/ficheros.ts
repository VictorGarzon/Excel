import { tabla } from "./tabla"

export interface Fichero {
    "id": number,
    "nombre": string,
    "descripcion": string,
    "fecha_creacion": Date,
    "fecha_mod": Date,
    "ultima_subida": string,
    "tipo": string,
    "permiso":number
    "data"?:tabla
}
