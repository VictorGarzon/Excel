import { tabla } from "./tabla"

export interface Fichero {
    "id": number,
    "nombre": string,
    "descripcion": string,
    "fecha_creacion": string,
    "fecha_mod": string,
    "ultima_subida": string,
    "tipo": string,
    "permiso": number
    "data"?: tabla
}
