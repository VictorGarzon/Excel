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
import { ModalCreateFichero } from "../modal-create-fichero/modal-create-fichero";
import { MessageService } from '../../services/message.service';
import { FicheroService } from '../../services/fichero.service';
import { Router } from '@angular/router'
import { ModalPermisos } from "../modal-permisos/modal-permisos";
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../models/user';
import { ModalEditUser } from "../modal-edit-user/modal-edit-user";

import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from "@angular/forms";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-home',
  imports: [NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule, NzButtonModule, NzTableModule, NzDividerModule, NzTypographyModule, ModalCreateFichero, ModalPermisos, ModalEditUser, NzInputModule, FormsModule, NzGridModule, NzFlexModule, NzPopconfirmModule],
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

  async abrir(fichero: Fichero) {
    try {
      let data = await firstValueFrom(
        this.api.get(`fichero/${fichero.id}/data`)
      )
      fichero.data = data
      this.ficheroService.fichero.set(fichero);
      this.router.navigate(['/main'])
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
}
