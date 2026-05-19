import { Component, computed, effect, inject, signal } from '@angular/core';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ApiService } from '../../services/api.service';
import { firstValueFrom } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Fichero } from '../../models/ficheros';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ModalCreateFichero } from "../../components/modal-create-fichero/modal-create-fichero";
import { MessageService } from '../../services/message.service';
import { FicheroService } from '../../services/fichero.service';
import { Router } from '@angular/router'
import { ModalPermisos } from "../../components/modal-permisos/modal-permisos";
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { ModalEditUser } from "../../components/modal-edit-user/modal-edit-user";

import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from "@angular/forms";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [NzDatePickerModule, NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule, NzButtonModule, NzTableModule, NzDividerModule, NzTypographyModule, ModalCreateFichero, ModalPermisos, ModalEditUser, NzInputModule, FormsModule, NzGridModule, NzFlexModule, NzPopconfirmModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  message = inject(MessageService)
  ficheroService = inject(FicheroService)
  router = inject(Router)
  auth = inject(AuthService)

  ficheros = signal<[Fichero] | []>([])

  users = signal<[User] | []>([])

  roles = signal<any>([])
  tipos = signal<any>([])
  fecha_mod_st = signal<Date | null>(null)
  fecha_mod_en = signal<Date | null>(null)
  fecha_cre_st = signal<Date | null>(null)
  fecha_cre_en = signal<Date | null>(null)

  loading = signal<boolean>(true)

  filtro = signal({});
  params = computed(() => {
    let params = new URLSearchParams(this.filtro()).toString()
    return params ? '?' + params : '';
  })

  constructor(private api: ApiService) {
    this.buscarFiltros();
    effect(() => {
      this.buscar();
    })
  }

  buscar() {
    let filtro = this.params();
    if (this.auth.isAdmin) {
      this.buscarUsers(filtro)
    } else {
      this.buscarFicheros(filtro)
    }
  }

  buscarFiltros() {
    if (this.auth.isAdmin) {
      this.buscarRoles()
    } else {
      this.buscarTipos()
    }
  }

  async buscarFicheros(filtro: string) {
    this.loading.set(true)
    try {
      let ficheros = await firstValueFrom(
        this.api.get("fichero" + filtro)
      )
      this.ficheros.set(ficheros);
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
    this.loading.set(false)
  }

  async buscarUsers(filtro: string) {
    this.loading.set(true)
    try {
      let users = await firstValueFrom(
        this.api.get("user" + filtro)
      )
      this.users.set(users);
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
    this.loading.set(false)
  }

  async buscarRoles() {
    try {
      let roles = await firstValueFrom(
        this.api.get("rol")
      )
      this.roles.set(roles);
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }

  async buscarTipos() {
    try {
      let tipos = await firstValueFrom(
        this.api.get("tipos")
      )
      this.tipos.set(tipos);
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }

  formatDate(date: string) {
    if (date) {
      return formatDate(date, 'yyyy-MM-dd', 'en-US')
    }
    return ''
  }

  async abrir(fichero: Fichero) {
    try {
      let newfichero = await firstValueFrom(
        this.api.get(`fichero/${fichero.id}/data`)
      )
      fichero.data = newfichero.data
      fichero.tipo = newfichero.tipo
      this.ficheroService.fichero.set(fichero);
      if (newfichero.tipo === 1) {
        this.router.navigate(['/main/hoja'])
      } else if (newfichero.tipo === 2) {
        this.router.navigate(['/main/texto'])
      }
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }

  inputBuscar(event: any) {
    let value = event.target.value
    if (this.auth.isAdmin) {
      this.filtro.update(f => ({ ...f, email: value }))
    } else {
      this.filtro.update(f => ({ ...f, nombre: value }))
    }
  }
  async deleteFic(id: number) {
    try {
      await firstValueFrom(
        this.api.delete(`fichero/${id}`)
      )
      this.buscar()
      this.message.createBasicMessage('success', 'Fichero eliminado')
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }

  async deleteUser(id: number) {
    try {
      await firstValueFrom(
        this.api.delete(`user/${id}`)
      )
      this.buscar()
      this.message.createBasicMessage('success', 'Usuario eliminado')
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }

  FicheroColumns: any[] = [
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: Fichero, b: Fichero) => a.nombre.localeCompare(b.nombre),
    },
    {
      name: 'Abrir',
    },
    {
      name: 'Editar',
    },
    {
      name: 'Editar Permisos',
    },
    {
      name: 'Eliminar',
    },
    {
      name: 'Descripcion',
    },
    {
      name: 'Permiso',
      sortOrder: null,
      sortFn: (a: Fichero, b: Fichero) => a.permiso - b.permiso,
    },
    {
      name: 'Fecha Creacion',
      sortOrder: null,
      sortFn: (a: Fichero, b: Fichero) => {
        const aF: any = new Date(a.fecha_creacion)
        const bF: any = new Date(b.fecha_creacion)
        return aF - bF;
      },
    },
    {
      name: 'Fecha Modificacion',
      sortOrder: 'descend',
      sortFn: (a: Fichero, b: Fichero) => {
        const aF: any = new Date(a.fecha_mod)
        const bF: any = new Date(b.fecha_mod)
        return aF - bF;
      },
    },
    {
      name: 'Ultima Subida',
      sortOrder: null,
      sortFn: (a: Fichero, b: Fichero) => a.ultima_subida.localeCompare(b.ultima_subida),
    },
    {
      name: 'Tipo',
      sortOrder: null,
      sortFn: (a: Fichero, b: Fichero) => a.tipo.localeCompare(b.tipo),
    },
  ];

  UserColumns: any[] = [
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      name: 'Rol',
      sortOrder: null,
      sortFn: (a: User, b: User) => a.rol.localeCompare(b.rol),
    },
    {
      name: 'Editar Contraseña'
    },
    {
      name: 'Eliminar Usuario',
    }
  ]
}
